import numpy as np, soundfile as sf, subprocess
from scipy.signal import butter, sosfilt, fftconvolve
SR=48000; INTRO=1.4; NI=int(INTRO*SR); rng=np.random.default_rng(11)
def load(p):
    y,sr=sf.read(p)
    if sr!=SR:
        n=int(len(y)*SR/sr); x=np.linspace(0,len(y)-1,n); y=np.stack([np.interp(x,np.arange(len(y)),(y if y.ndim==1 else y[:,c])) for c in range(1 if y.ndim==1 else 2)],1)
    return y if y.ndim==2 and y.shape[1]==2 else np.repeat(y.reshape(len(y),-1)[:,:1],2,1)
def norm_peak(y,db=-1): return y*(10**(db/20)/max(1e-9,np.abs(y).max()))
def vary(y,rate):
    n=int(len(y)/rate); x=np.linspace(0,len(y)-1,n)
    return np.stack([np.interp(x,np.arange(len(y)),y[:,c]) for c in range(2)],1)
def place(bus,y,t,g=0):
    s=int(t*SR); y=y*10**(g/20)
    if s<0: y=y[-s:]; s=0
    e=min(len(bus),s+len(y)); bus[s:e]+=y[:e-s]
def sub(d=0.6,f=50):
    tt=np.arange(int(d*SR))/SR; s=np.sin(2*np.pi*f*tt*(1-0.3*tt/d))*np.exp(-tt*6); return norm_peak(np.stack([s,s],1))
def glitchburst(d=0.12):
    n=int(d*SR); y=rng.standard_normal(n); y=np.round(y*4)/4                      # crushed noise
    y*= (np.sin(np.arange(n)/SR*2*np.pi*55)>0)*0.8+0.2; y*=np.exp(-np.arange(n)/SR*12)
    y=sosfilt(butter(2,[400,7000],'bandpass',fs=SR,output='sos'),y); return norm_peak(np.stack([y,np.roll(y,90)],1))
def peak_t(y): return np.argmax(np.abs(y).mean(1))/SR
S={k:norm_peak(load(f'{k}.wav')) for k in ['slam','whoosh','shimmer','logohit','timerstop','pop']}
# music for the title: 3 beats (1.395 s) from the track's energetic part, cut on the glitch into the opener
m=load('/home/claude/alfa/v12/m.wav'); b0=int(16*0.4651*SR)
mus=m[b0:b0+NI].copy(); f=int(0.12*SR); mus[-f:]*=np.linspace(1,0,f)[:,None]; mus[:int(0.02*SR)]*=np.linspace(0,1,int(0.02*SR))[:,None]
bus=np.zeros((NI+int(1.5*SR),2)); bus[:NI]+=mus*10**(-3/20)
lands=[0.08+i*0.055+0.2 for i in range(4)]
for i,tl in enumerate(lands):
    place(bus,vary(S['slam'],1.5+0.12*i)[:int(0.35*SR)],tl-0.02,-7)          # letter hits
    place(bus,glitchburst(0.06),tl,-16)
y=vary(S['whoosh'],1.6)[::-1].copy(); place(bus,y,0.28-peak_t(y),-12)     # suck-in before the first hit
place(bus,sub(0.9,44),lands[-1],-2)                                         # shockwave boom
place(bus,vary(S['logohit'],1.15),lands[-1]-0.03,-5)
y=vary(S['whoosh'],1.8); place(bus,y,0.52-peak_t(y),-16)                  # logo wipe
place(bus,vary(S['shimmer'],1.3)[:int(0.6*SR)],0.6,-10)                   # sparkle
y=vary(S['whoosh'],0.9); place(bus,y,1.18-peak_t(y),-8)                   # letters fly at the camera
place(bus,glitchburst(0.16),1.24,-9)
rest=load('mix17body_raw.wav')
N=NI+len(rest); mix=np.zeros((N,2)); mix[:len(bus)]+=bus; mix[NI:]+=rest
sf.write('mix17_raw.wav',mix,SR,subtype='FLOAT')
subprocess.run(['ffmpeg','-v','error','-y','-i','mix17_raw.wav','-af','loudnorm=I=-14:TP=-1.0:LRA=11,alimiter=limit=0.89:level=0,aresample=48000','-ac','2','mix17.wav'],check=True)
y,_=sf.read('mix17.wav'); print('len',len(y)/SR,'peak dB',20*np.log10(np.abs(y).max()))
