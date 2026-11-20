import numpy as np, soundfile as sf, subprocess
from scipy.signal import butter, sosfilt, fftconvolve
SR=48000; DURV=23.0; N=int(DURV*SR); P=1.3; A1=4.767
def T(x):
    y = x+P if x>=A1 else x
    return y+1.7 if y>=7.0 else y
rng=np.random.default_rng(7)
def load(p):
    y,sr=sf.read(p); assert sr==SR; return y if y.ndim==2 else np.stack([y,y],1)
def norm_peak(y,db=-1): return y*(10**(db/20)/max(1e-9,np.abs(y).max()))
def place(bus,y,t,gain_db=0,fade_out=None,raw=False):
    if not raw: t=T(t)
    s=int(t*SR); y=y*10**(gain_db/20)
    if fade_out: f=min(int(fade_out*SR),len(y)); y=y.copy(); y[-f:]*=np.linspace(1,0,f)[:,None]
    if s<0: y=y[-s:]; s=0
    e=min(N,s+len(y)); bus[s:e]+=y[:e-s]
def vary(y,rate):  # pitch+speed change for whoosh variety
    n=int(len(y)/rate); x=np.linspace(0,len(y)-1,n)
    return np.stack([np.interp(x,np.arange(len(y)),y[:,c]) for c in range(2)],1)
def peak_t(y): return np.argmax(np.abs(y).mean(1))/SR
# --- synth riser: band-limited noise sweeping up + rising sine, ends on the hit
def riser(d=1.25):
    n=int(d*SR); tt=np.arange(n)/SR; out=np.zeros(n)
    noise=rng.standard_normal(n)
    for k in range(10):
        a,b=k*n//10,(k+1)*n//10; f=300*2**(k*0.55)
        seg=sosfilt(butter(2,[f,min(f*2.2,20000)],'bandpass',fs=SR,output='sos'),noise)[a:b]; out[a:b]=seg
    f0,f1=180,1400; ph=2*np.pi*np.cumsum(f0*(f1/f0)**(tt/d))/SR
    out=out/np.abs(out).max()+0.35*np.sin(ph)
    env=(tt/d)**2.6; out*=env
    st=np.stack([out*(1-0.15*np.sin(tt*9)),out*(1+0.15*np.sin(tt*9))],1)
    return norm_peak(st)
def reverb(y,d=1.6,wet=0.35):
    n=int(d*SR); ir=rng.standard_normal((n,2))*np.exp(-np.arange(n)/SR*4.5)[:,None]
    ir=sosfilt(butter(2,6000,'low',fs=SR,output='sos'),ir,axis=0)
    w=np.stack([fftconvolve(y[:,c],ir[:,c]) for c in range(2)],1); w=norm_peak(w,-1)*wet
    o=np.zeros_like(w); o[:len(y)]=y; return o+w
def sub(d=0.9,f=48):
    tt=np.arange(int(d*SR))/SR; s=np.sin(2*np.pi*f*tt*(1-0.25*tt/d))*np.exp(-tt*4.2); return norm_peak(np.stack([s,s],1))

m=load('/home/claude/alfa/v12/m_cut11.wav')
bt=1.395; a=int(A1*SR); c=int((A1-bt)*SR); xf=int(0.03*SR)
ins=m[c:a].copy(); ins[:xf]*=np.linspace(0,1,xf)[:,None]
m2=np.concatenate([m[:a],ins,m[a:]])
P2=int(8.067*SR); b4=int(4*0.4651*SR); ins2=m2[P2-b4:P2].copy(); ins2[:xf]*=np.linspace(0,1,xf)[:,None]
music=np.concatenate([m2[:P2],ins2,m2[P2:]])[:N]
if len(music)<N: music=np.concatenate([music,np.zeros((N-len(music),2))])
t=np.arange(N)/SR
g=np.interp(t,[0,5.6,6.15,19.9,20.07,20.6,20.95,21.22,21.5,DURV],[-7,-7,0,0,-5,0,0,-4,-1,0])
music=music*(10**(g/20))[:,None]
sfx=np.zeros((N,2))
# --- the run (v17): energetic music carries on from the title; real footsteps approach the camera ---
mraw=load('/home/claude/alfa/v12/m.wav'); bt=0.4651
cont=mraw[int(19*bt*SR):int(19*bt*SR)+int(4.6*SR)].copy()          # continues right where the title's 3 beats end
genv=np.interp(np.arange(len(cont))/SR,[0,1.6,1.75,2.2,4.3,4.6],[-3,-1,-8,-5,-4,-30])  # dip under the slam, out under the slap
cont*=(10**(genv/20))[:,None]
cut=int(4.5*SR); xf=int(0.1*SR)
w=np.ones(N); w[:cut-xf]=0; w[cut-xf:cut]=np.linspace(0,1,xf)                          # original (ducked) music only from the slap on
music=music*w[:,None]; music[:len(cont)]+=cont*(1-w[:len(cont)])[:,None]
run=load('run.wav'); run=run[int(0.38*SR):int(2.15*SR)]
rt=np.arange(len(run))/SR; ramp=10**(np.interp(rt,[0,1.0,1.6,1.77],[-16,-8,-1,0])/20)
lp=sosfilt(butter(2,2500,'low',fs=SR,output='sos'),run,axis=0); mixw=np.clip(rt/1.4,0,1)[:,None]
run=(lp*(1-mixw)+run*mixw)*ramp[:,None]                                                 # far + muffled -> close + bright
place(sfx,norm_peak(run,-1),0.0,-3)
y=vary(load('whoosh.wav'),0.8); place(sfx,norm_peak(y),1.75-np.argmax(np.abs(y).mean(1))/SR,-10)   # rush into the glass
S={k:norm_peak(load(f'{k}.wav')) for k in ['slam','papers','paperslap','shimmer','whoosh','whip','pop','timerstop','logohit']}
W=S['whoosh']; wp=peak_t(W)
def whoosh(tc,rate,gain,rev=False):
    y=vary(W,rate); 
    if rev: y=y[::-1].copy()
    place(sfx,y,T(tc)-peak_t(y),gain,raw=True)
place(sfx,S['slam'],1.75-0.27,0)
place(sfx,S['papers'],1.85,-10,fade_out=0.8)
place(sfx,S['paperslap'],4.5-0.16,-3)
# 8: riser into ALFA + impact on reveal
R=riser(1.6); place(sfx,R,T(4.90)-len(R)/SR,-8,raw=True)
place(sfx,sub(1.0,46),4.90,-4)
place(sfx,S['timerstop'],4.90-0.15,-6)
place(sfx,reverb(S['shimmer'][:int(1.2*SR)]),4.95,-8)

# --- the pile (raw times) ---
def blip(f=880,d=0.16):
    tt=np.arange(int(d*SR))/SR; y=np.sign(np.sin(2*np.pi*f*tt))*0.5+np.sin(2*np.pi*f*1.5*tt)*0.3
    y*=np.exp(-tt*18)*(tt<d); y=sosfilt(butter(2,4000,'low',fs=SR,output='sos'),y); return norm_peak(np.stack([y,y],1))
DROPS=[4.847,5.007,5.167,5.327,5.487]; ERR=[False,True,False,False,True]
for i,(d0,e) in enumerate(zip(DROPS,ERR)):
    place(sfx,vary(S['paperslap'],1.35+0.08*i),d0+0.22,-14,raw=True)
    place(sfx,vary(S['pop'],0.8),d0+0.24,-15,raw=True)
    if e: place(sfx,np.concatenate([blip(620),blip(470)]),d0+0.32,-20,raw=True)
    else: place(sfx,blip(1150,0.09),d0+0.30,-24,raw=True)
y=vary(W,0.75); place(sfx,y,6.067+0.05-peak_t(y),-6,raw=True)   # cards blown away

# --- the chat (raw v16 times) ---
y=vary(W,1.4); place(sfx,y,7.20-peak_t(y),-17,raw=True)            # panel rises
y=vary(W,1.2); place(sfx,y,7.42-peak_t(y),-15,raw=True)            # photo flies into the message
y=vary(W,1.6)[::-1].copy(); place(sfx,y,7.40-peak_t(y),-16,raw=True)   # message "send"
place(sfx,vary(S['pop'],1.3),7.37,-10,raw=True)
for i in range(3): place(sfx,blip(1900,0.05),7.72+i*0.08,-30,raw=True)   # typing dots
place(sfx,vary(S['pop'],0.95),7.95,-11,raw=True)                   # reply
for i in range(5): place(sfx,vary(S['pop'],1.5+0.06*i),8.12+i*0.10,-18,raw=True)   # plan rows
y=vary(W,1.3); place(sfx,y,9.45-peak_t(y),-12,raw=True)            # plan collapses into the chip
place(sfx,vary(S['pop'],1.1),9.55,-11,raw=True)
# 9: soft whooshes for the watch match-cuts + chip ticks
pass                     # chip appears under ALFA
pass                             # chip flies to the corner
whoosh(7.02,0.9,-8)                              # photo -> product video (watch locked)
whoosh(9.17,1.05,-10,rev=True)                   # product -> billboard
whoosh(11.12,1.2,-10)                            # billboard -> UGC
for i,ts in enumerate([8.917,10.867,12.817,14.567,16.267]):   # each finished output: tick on the chip
    place(sfx,vary(S['pop'],1.15+0.05*i),ts+0.05,-13)
whoosh(12.99,1.35,-12)                           # shrink into the 16:9 card
place(sfx,S['pop'],13.22,-15); place(sfx,S['pop'],13.32,-16)
whoosh(14.72,0.95,-11)                           # push to calendar
for i,tt in enumerate(np.arange(14.93,15.5,0.08)): place(sfx,vary(S['pop'],1+0.04*i),tt,-18)
whoosh(16.55,0.85,-9)                            # chip flies to centre, becomes the big timer
place(sfx,S['timerstop'],17.067-0.15,-1)
place(sfx,sub(0.8,52),17.067,-6)
# 10: end
whoosh(17.95,0.9,-11)
LH=reverb(S['logohit'],2.2,0.45); place(sfx,LH,18.22,-2)
place(sfx,sub(1.4,42),18.24,-3)
mix=music+sfx
fo=int(0.6*SR); mix[-fo:]*=np.linspace(1,0,fo)[:,None]
sf.write('mix17body_raw.wav',mix,SR,subtype='FLOAT')
subprocess.run(['ffmpeg','-v','error','-y','-i','mix17body_raw.wav','-af','loudnorm=I=-14:TP=-1.0:LRA=11,alimiter=limit=0.89:level=0,aresample=48000','-ac','2','mix17body.wav'],check=True)
y,_=sf.read('mix17body.wav'); print('len',len(y)/SR,'peak dB',20*np.log10(np.abs(y).max()))
