var M_WIDTH=800, M_HEIGHT=450;
var app, assets={},fbs,SERVER_TM, game_name='monopoly', yndx_payments, game, client_id, objects={}, state='',my_role="", game_tick=0, made_moves=0, game_id=0, my_turn=0,my_turn_started=0, opponent=0,connected = 1, LANG = 0, hidden=0, h_state=0, game_platform="",git_src='./', room_name = '',pending_player='',tm={}, some_process = {}, my_data={opp_id : ''},opp_data={};

const WIN = 1, DRAW = 0, LOSE = -1, NOSYNC = 2;

const cells_data=[{id:0,type:"start"},{id:1,type:"city",rus_name:"Канпур",eng_name:"Kanpur",country:1,price:50,house_cost:50,rent:[0,5,20,60,140,170,200],owner:0,level:0},{id:2,type:"city",rus_name:"Сурат",eng_name:"Surat",country:1,price:50,house_cost:50,auc:1,rent:[0,5,20,60,140,170,200],owner:0,level:0},{id:3,type:"city",rus_name:"Дели",eng_name:"Deli",country:1,price:50,house_cost:50,rent:[0,5,20,60,140,170,200],owner:0,level:0},{id:4,type:"city",rus_name:"Уфа",eng_name:"Ufa",country:2,price:75,house_cost:75,rent:[0,9,32,97,227,275,324],owner:0,level:0},{id:5,type:"city",rus_name:"Казань",eng_name:"Kazan",country:2,price:75,house_cost:75,auc:1,rent:[0,9,32,97,227,275,324],owner:0,level:0},{id:6,type:"city",rus_name:"Москва",eng_name:"Moscow",country:2,price:75,house_cost:75,rent:[0,9,32,97,227,275,324],owner:0,level:0},{id:7,type:"?"},{id:8,type:"city",rus_name:"Холон",eng_name:"Holon",country:3,price:100,house_cost:100,rent:[0,14,45,136,318,386,454],owner:0,level:0},{id:9,type:"city",rus_name:"Ашдод",eng_name:"Ashdod",country:3,price:100,house_cost:100,auc:1,rent:[0,14,45,136,318,386,454],owner:0,level:0},{id:10,type:"city",rus_name:"София",eng_name:"Sofia",country:4,price:125,house_cost:125,rent:[0,20,58,175,408,496,583],owner:0,level:0},{id:11,type:"city",rus_name:"Варна",eng_name:"Varna",country:4,price:125,house_cost:125,auc:1,rent:[0,20,58,175,408,496,583],owner:0,level:0},{id:12,type:"casino"},{id:13,type:"city",rus_name:"Рим",eng_name:"Rim",country:5,price:150,house_cost:150,rent:[0,27,71,213,496,602,709],owner:0,level:0},{id:14,type:"city",rus_name:"Милан",eng_name:"Milan",country:5,price:150,house_cost:150,auc:1,rent:[0,27,71,213,496,602,709],owner:0,level:0},{id:15,type:"city",rus_name:"Турин",eng_name:"Turin",country:5,price:150,house_cost:150,rent:[0,27,71,213,496,602,709],owner:0,level:0},{id:16,type:"city",rus_name:"Лондон",eng_name:"London",country:6,price:200,house_cost:200,rent:[0,40,94,283,661,803,945],owner:0,level:0},{id:17,type:"city",rus_name:"Глазго",eng_name:"Glazgo",country:6,price:200,house_cost:200,auc:1,rent:[0,40,94,283,661,803,945],owner:0,level:0},{id:18,type:"city",rus_name:"Плимут",eng_name:"Plimut",country:6,price:200,house_cost:200,rent:[0,40,94,283,661,803,945],owner:0,level:0},{id:19,type:"?"},{id:20,type:"city",rus_name:"Париж",eng_name:"Paris",country:7,price:250,house_cost:250,rent:[0,55,117,351,818,994,1169],owner:0,level:0},{id:21,type:"city",rus_name:"Лион",eng_name:"Lyon",country:7,price:250,house_cost:250,auc:1,rent:[0,55,117,351,818,994,1169],owner:0,level:0},{id:22,type:"city",rus_name:"Даллас",eng_name:"Dallas",country:8,price:300,house_cost:300,rent:[0,72,138,413,964,1171,1377],owner:0,level:0},{id:23,type:"city",rus_name:"Чикаго",eng_name:"Chicago",country:8,price:300,house_cost:300,auc:1,rent:[0,72,138,413,964,1171,1377],owner:0,level:0}]

const chip_anchors=[
	{dx:-1,dy:-1,ang:45},
	{dx:0,dy:-1,ang:90},
	{dx:0,dy:-1,ang:90},
	{dx:0,dy:-1,ang:90},
	{dx:0,dy:-1,ang:90},
	{dx:0,dy:-1,ang:90},
	{dx:0,dy:-1,ang:90},
	{dx:1,dy:-1,ang:135},
	{dx:1,dy:0,ang:180},
	{dx:1,dy:0,ang:180},
	{dx:1,dy:0,ang:180},
	{dx:1,dy:0,ang:180},
	{dx:1,dy:1,ang:-135},
	{dx:0,dy:1,ang:-90},
	{dx:0,dy:1,ang:-90},
	{dx:0,dy:1,ang:-90},
	{dx:0,dy:1,ang:-90},
	{dx:0,dy:1,ang:-90},
	{dx:0,dy:1,ang:-90},
	{dx:-1,dy:1,ang:-45},
	{dx:-1,dy:0,ang:0},
	{dx:-1,dy:0,ang:0},
	{dx:-1,dy:0,ang:0},
	{dx:-1,dy:0,ang:0}
]

r2 = (v)=>{
	return (v >= 0 || -1) * Math.round(Math.abs(v)*10000)/10000;
}

quat={

	multiply( a, b ) {

		let q = {};

		const qax = a.x, qay = a.y, qaz = a.z, qaw = a.w;
		const qbx = b.x, qby = b.y, qbz = b.z, qbw = b.w;

		q.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
		q.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
		q.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
		q.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

		return q;
	},

	normalizeVector(vector) {
	  const x = vector.x;
	  const y = vector.y;
	  const z = vector.z;

	  const magnitude = Math.sqrt(x * x + y * y + z * z);

	  if (magnitude !== 0) {
		vector.x=x / magnitude,
		vector.y=y / magnitude,
		vector.z=z / magnitude
	  } else {
		throw new Error("Cannot normalize a zero vector.");
	  }
	},

	vec_len2D(vec){

		return Math.sqrt(vec.x * vec.x + vec.y * vec.y);

	},

	create(vec, ang){

		this.normalizeVector(vec);
		const q={w:0,x:0,y:0,z:0};
		const halfAngle = ang / 2
		const s = Math.sin(halfAngle);
		q.x = vec.x * s;
		q.y = vec.y * s;
		q.z = vec.z * s;
		q.w = Math.cos( halfAngle );
		return q;
	},

	update(q, vec, ang){
		this.normalizeVector(vec);
		const halfAngle = ang / 2
		const s = Math.sin(halfAngle);
		q.x = vec.x * s;
		q.y = vec.y * s;
		q.z = vec.z * s;
		q.w = Math.cos( halfAngle );
	},

	rotate_vec_by_quat(vec, q){

		//результат вращения вектора
		const rot_quat2={w:q.w,x:-q.x,y:-q.y,z:-q.z};
		const qm1=this.multiply(q,vec);
		const res=this.multiply(qm1,rot_quat2);
		vec.x=res.x;
		vec.y=res.y;
		vec.z=res.z;

	},

	angleToZ(vec) {
		const dotProduct = vec.z;
		const magnitude = Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);
		const angleInRadians = Math.acos(dotProduct / magnitude);
		return angleInRadians*180/Math.PI;
	}

}

irnd = function(min,max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

anim3={

	c1: 1.70158,
	c2: 1.70158 * 1.525,
	c3: 1.70158 + 1,
	c4: (2 * Math.PI) / 3,
	c5: (2 * Math.PI) / 4.5,
	empty_spr : {x:0,visible:false,ready:true, alpha:0},

	slots: new Array(20).fill().map(u => ({obj:{},on:0,block:true,params_num:0,p_resolve:0,progress:0,vis_on_end:false,tm:0,params:new Array(10).fill().map(u => ({param:'x',s:0,f:0,d:0,func:this.linear}))})),

	any_on() {

		for (let s of this.slots)
			if (s.on&&s.block)
				return true
		return false;
	},

	wait(seconds){
		return this.add(this.empty_spr,{x:[0,1,'linear']}, false, seconds);
	},

	linear(x) {
		return x
	},

	kill_anim(obj) {

		for (var i=0;i<this.slots.length;i++){
			const slot=this.slots[i];
			if (slot.on&&slot.obj===obj){
				slot.p_resolve(2);
				slot.on=0;
			}
		}
	},

	easeBridge(x){

		if(x<0.1)
			return x*10;
		if(x>0.9)
			return (1-x)*10;
		return 1
	},

	easeOutBack(x) {
		return 1 + this.c3 * Math.pow(x - 1, 3) + this.c1 * Math.pow(x - 1, 2);
	},

	easeOutElastic(x) {
		return x === 0
			? 0
			: x === 1
			? 1
			: Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * this.c4) + 1;
	},

	easeOutSine(x) {
		return Math.sin( x * Math.PI * 0.5);
	},

	easeOutQuart(x){
		return 1 - Math.pow(1 - x, 4);
	},

	easeOutCubic(x) {
		return 1 - Math.pow(1 - x, 3);
	},

	flick(x){

		return Math.abs(Math.sin(x*6.5*3.141593));

	},

	easeInBack(x) {
		return this.c3 * x * x * x - this.c1 * x * x;
	},

	easeInQuad(x) {
		return x * x;
	},

	easeOutBounce(x) {
		const n1 = 7.5625;
		const d1 = 2.75;

		if (x < 1 / d1) {
			return n1 * x * x;
		} else if (x < 2 / d1) {
			return n1 * (x -= 1.5 / d1) * x + 0.75;
		} else if (x < 2.5 / d1) {
			return n1 * (x -= 2.25 / d1) * x + 0.9375;
		} else {
			return n1 * (x -= 2.625 / d1) * x + 0.984375;
		}
	},

	easeInCubic(x) {
		return x * x * x;
	},

	ease3peaks(x){

		if (x < 0.16666) {
			return x / 0.16666;
		} else if (x < 0.33326) {
			return 1-(x - 0.16666) / 0.16666;
		} else if (x < 0.49986) {
			return (x - 0.3326) / 0.16666;
		} else if (x < 0.66646) {
			return 1-(x - 0.49986) / 0.16666;
		} else if (x < 0.83306) {
			return (x - 0.6649) / 0.16666;
		} else if (x >= 0.83306) {
			return 1-(x - 0.83306) / 0.16666;
		}
	},

	ease2back(x) {
		return Math.sin(x*Math.PI);
	},

	easeInOutCubic(x) {

		return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
	},

	easeInOutBack(x) {

		return x < 0.5
		  ? (Math.pow(2 * x, 2) * ((this.c2 + 1) * 2 * x - this.c2)) / 2
		  : (Math.pow(2 * x - 2, 2) * ((this.c2 + 1) * (x * 2 - 2) + this.c2) + 2) / 2;
	},

	shake(x) {

		return Math.sin(x*2 * Math.PI);


	},

	add (obj, inp_params, vis_on_end, time, block) {

		//если уже идет анимация данного спрайта то отменяем ее
		anim3.kill_anim(obj);


		let found=false;
		//ищем свободный слот для анимации
		for (let i = 0; i < this.slots.length; i++) {

			const slot=this.slots[i];
			if (slot.on) continue;

			found=true;

			obj.visible = true
			obj.ready = false

			//заносим базовые параметры слота
			slot.on=1;
			slot.params_num=Object.keys(inp_params).length;
			slot.obj=obj;
			slot.vis_on_end=vis_on_end;
			slot.block=block===undefined;
			slot.speed=0.01818 / time;
			slot.progress=0;

			//добавляем дельту к параметрам и устанавливаем начальное положение
			let ind=0;
			for (const param in inp_params) {

				const s=inp_params[param][0];
				let f=inp_params[param][1];
				const d=f-s;


				//для возвратных функцие конечное значение равно начальному что в конце правильные значения присвоить
				const func_name=inp_params[param][2];
				const func=anim3[func_name].bind(anim3);
				if (func_name === 'ease2back'||func_name==='shake') f=s;

				slot.params[ind].param=param;
				slot.params[ind].s=s;
				slot.params[ind].f=f;
				slot.params[ind].d=d;
				slot.params[ind].func=func;
				ind++;

				//фиксируем начальное значение параметра
				obj[param]=s;
			}

			return new Promise(resolve=>{
				slot.p_resolve = resolve;
			});
		}

		console.log("Кончились слоты анимации");

		//сразу записываем конечные параметры анимации
		for (let param in params)
			obj[param]=params[param][1];
		obj.visible=vis_on_end;
		obj.alpha = 1;
		obj.ready=true;


	},

	process () {

		for (var i = 0; i < this.slots.length; i++) {
			const slot=this.slots[i];
			const obj=slot.obj;
			if (slot.on) {

				slot.progress+=slot.speed;

				for (let i=0;i<slot.params_num;i++){

					const param_data=slot.params[i];
					const param=param_data.param;
					const s=param_data.s;
					const d=param_data.d;
					const func=param_data.func;
					slot.obj[param]=s+d*func(slot.progress);
				}

				//если анимация завершилась то удаляем слот
				if (slot.progress>=0.999) {

					//заносим конечные параметры
					for (let i=0;i<slot.params_num;i++){
						const param=slot.params[i].param;
						const f=slot.params[i].f;
						slot.obj[param]=f;
					}

					slot.obj.visible=slot.vis_on_end;
					if(!slot.vis_on_end) slot.obj.alpha=1;

					slot.obj.ready=true
					slot.p_resolve(1)
					slot.on = 0
				}
			}
		}
	}
}

scheduler={

	ids: new Set(),

	add(func,tm){
		const id=setTimeout(()=>{func();this.ids.delete(id)},tm)
		this.ids.add(id)
	},

	stop_all(){

		this.ids.forEach(id => clearTimeout(id))
		this.ids.clear()
	}

}

fbs_once=async function(path){
	const info=await fbs.ref(path).get();
	return info.val();
}

class lb_player_card_class extends PIXI.Container{

	constructor(x,y,place) {
		super();

		this.bcg=new PIXI.Sprite(assets.lb_player_card_bcg);
		this.bcg.interactive=true;
		this.bcg.pointerover=function(){this.tint=0x55ffff};
		this.bcg.pointerout=function(){this.tint=0xffffff};
		this.bcg.width = 370;
		this.bcg.height = 70;

		this.place=new PIXI.BitmapText('', {fontName: 'mfont32',fontSize: 25,align: 'center'});
		this.place.tint=0xffff00;
		this.place.x=20;
		this.place.y=22;

		this.avatar=new PIXI.Sprite();
		this.avatar.x=43;
		this.avatar.y=12;
		this.avatar.width=this.avatar.height=45;


		this.name=new PIXI.BitmapText('', {fontName: 'mfont32',fontSize: 22,align: 'center'});
		this.name.tint=0xaaffaa;
		this.name.x=105;
		this.name.y=22;


		this.rating=new PIXI.BitmapText('', {fontName: 'mfont32',fontSize: 25,align: 'center'});
		this.rating.x=298;
		this.rating.tint=0xffffff;
		this.rating.y=22;

		this.addChild(this.bcg,this.place, this.avatar, this.name, this.rating);
	}

}

class just_avatar_class extends PIXI.Container{

	constructor(size){

		super();

		this.shadow=new PIXI.Sprite(assets.avatar_shadow);
		this.shadow.width=this.shadow.height=size;

		this.avatar=new PIXI.Sprite();
		this.avatar.width=this.avatar.height=size-20;
		this.avatar.x=this.avatar.y=10;

		this.frame=new PIXI.Sprite(assets.avatar_frame);
		this.frame.width=this.frame.height=size;

		this.avatar_mask=new PIXI.Sprite(assets.avatar_mask);
		this.avatar_mask.width=this.avatar_mask.height=size;

		this.avatar.mask=this.avatar_mask;


		this.addChild(this.shadow,this.avatar_mask,this.avatar,this.frame,this.avatar_mask,)

	}

}

class chat_record_class extends PIXI.Container {

	constructor() {

		super();

		this.tm=0;
		this.index=0;
		this.uid='';


		this.avatar = new PIXI.Graphics();
		this.avatar.w=50;
		this.avatar.h=50;
		this.avatar.x=30;
		this.avatar.y=13;

		this.avatar_bcg = new PIXI.Sprite(assets.chat_avatar_bcg_img);
		this.avatar_bcg.width=70;
		this.avatar_bcg.height=70;
		this.avatar_bcg.x=this.avatar.x-10;
		this.avatar_bcg.y=this.avatar.y-10;
		this.avatar_bcg.interactive=true;
		this.avatar_bcg.pointerdown=()=>chat.avatar_down(this);

		this.avatar_frame = new PIXI.Sprite(assets.chat_avatar_frame_img);
		this.avatar_frame.width=70;
		this.avatar_frame.height=70;
		this.avatar_frame.x=this.avatar.x-10;
		this.avatar_frame.y=this.avatar.y-10;

		this.name = new PIXI.BitmapText('Имя Фамил', {fontName: 'mfont32',fontSize: 17});
		this.name.anchor.set(0,0.5);
		this.name.x=this.avatar.x+72;
		this.name.y=this.avatar.y-1;
		this.name.tint=0xFBE5D6;

		this.gif=new PIXI.Sprite();
		this.gif.x=this.avatar.x+65;
		this.gif.y=22;

		this.gif_bcg=new PIXI.Graphics();
		this.gif_bcg.beginFill(0x111111)
		this.gif_bcg.drawRect(0,0,1,1);
		this.gif_bcg.x=this.gif.x+3;
		this.gif_bcg.y=this.gif.y+3;
		this.gif_bcg.alpha=0.5;



		this.msg_bcg = new PIXI.NineSlicePlane(assets.msg_bcg,50,18,50,28);
		//this.msg_bcg.width=160;
		//this.msg_bcg.height=65;
		this.msg_bcg.scale_xy=0.66666;
		this.msg_bcg.x=this.avatar.x+45;
		this.msg_bcg.y=this.avatar.y+2;

		this.msg = new PIXI.BitmapText('Имя Фамил', {fontName: 'mfont32',fontSize: 19,lineSpacing:55,align: 'left'});
		this.msg.x=this.avatar.x+75;
		this.msg.y=this.avatar.y+30;
		this.msg.maxWidth=450;
		this.msg.anchor.set(0,0.5);
		this.msg.tint = 0xffffff;

		this.msg_tm = new PIXI.BitmapText('28.11.22 12:31', {fontName: 'mfont32',fontSize: 15});
		this.msg_tm.tint=0xffffff;
		this.msg_tm.alpha=0.6;
		this.msg_tm.anchor.set(1,0);

		this.visible = false;
		this.addChild(this.msg_bcg,this.gif_bcg,this.gif,this.avatar_bcg,this.avatar,this.avatar_frame,this.name,this.msg,this.msg_tm);

	}

	nameToColor(name) {
		  // Create a hash from the name
		  let hash = 0;
		  for (let i = 0; i < name.length; i++) {
			hash = name.charCodeAt(i) + ((hash << 5) - hash);
			hash = hash & hash; // Convert to 32bit integer
		  }

		  // Generate a color from the hash
		  let color = ((hash >> 24) & 0xFF).toString(16) +
					  ((hash >> 16) & 0xFF).toString(16) +
					  ((hash >> 8) & 0xFF).toString(16) +
					  (hash & 0xFF).toString(16);

		  // Ensure the color is 6 characters long
		  color = ('000000' + color).slice(-6);

		  // Convert the hex color to an RGB value
		  let r = parseInt(color.slice(0, 2), 16);
		  let g = parseInt(color.slice(2, 4), 16);
		  let b = parseInt(color.slice(4, 6), 16);

		  // Ensure the color is bright enough for a black background
		  // by normalizing the brightness.
		  if ((r * 0.299 + g * 0.587 + b * 0.114) < 128) {
			r = Math.min(r + 128, 255);
			g = Math.min(g + 128, 255);
			b = Math.min(b + 128, 255);
		  }

		  return (r << 16) + (g << 8) + b;
	}

	async update_avatar(uid, tar_sprite) {

		//определяем pic_url
		await players_cache.update(uid);
		await players_cache.update_avatar(uid);
		tar_sprite.set_texture(players_cache.players[uid].texture);
	}

	async set(msg_data) {

		//получаем pic_url из фб
		this.avatar.set_texture(PIXI.Texture.WHITE);

		await this.update_avatar(msg_data.uid, this.avatar);

		this.uid=msg_data.uid;
		this.tm = msg_data.tm;
		this.index = msg_data.index;

		this.name.set2(msg_data.name,150);
		this.name.tint=this.nameToColor(msg_data.name);
		this.msg_tm.text = new Date(msg_data.tm).toLocaleString();
		this.msg.text=msg_data.msg;
		this.visible = true;

		if (msg_data.msg.startsWith('GIF')){

			const mp4BaseT=await new Promise((resolve, reject)=>{
				const baseTexture = PIXI.BaseTexture.from('https://akukamil.github.io/common/gifs/'+msg_data.msg+'.mp4');
				if (baseTexture.width>1) resolve(baseTexture);
				baseTexture.on('loaded', () => resolve(baseTexture));
				baseTexture.on('error', (error) => resolve(null));
			});

			if (!mp4BaseT) {
				this.visible=false;
				return 0;
			}

			mp4BaseT.resource.source.play();
			mp4BaseT.resource.source.loop=true;

			this.gif.texture=PIXI.Texture.from(mp4BaseT);
			this.gif.visible=true;
			const aspect_ratio=mp4BaseT.width/mp4BaseT.height;
			this.gif.height=90;
			this.gif.width=this.gif.height*aspect_ratio;
			this.msg_bcg.visible=false;
			this.msg.visible=false;
			this.msg_tm.anchor.set(0,0);
			this.msg_tm.y=this.gif.height+9;
			this.msg_tm.x=this.gif.width+102;

			this.gif_bcg.visible=true;
			this.gif_bcg.height=this.gif.height;
			this.gif_bcg.width=	this.gif.width;
			return this.gif.height+30;

		}else{

			this.gif_bcg.visible=false;
			this.gif.visible=false;
			this.msg_bcg.visible=true;
			this.msg.visible=true;

			//бэкграунд сообщения в зависимости от длины
			const msg_bcg_width=Math.max(this.msg.width,100)+100;
			this.msg_bcg.width=msg_bcg_width*1.5;

			if (msg_bcg_width>300){
				this.msg_tm.anchor.set(1,0);
				this.msg_tm.y=this.avatar.y+52;
				this.msg_tm.x=msg_bcg_width+55;
			}else{
				this.msg_tm.anchor.set(0,0);
				this.msg_tm.y=this.avatar.y+37;
				this.msg_tm.x=msg_bcg_width+62;
			}

			return 70;
		}
	}

}

class player_mini_card_class extends PIXI.Container {

	constructor(x,y,id) {
		super();
		this.visible=false;
		this.id=id;
		this.uid=0;
		this.type = 'single';
		this.x=x;
		this.y=y;


		this.bcg=new PIXI.Sprite(assets.mini_player_card);
		this.bcg.width=200;
		this.bcg.height=90;
		this.bcg.interactive=true;
		this.bcg.buttonMode=true;
		this.bcg.pointerdown=function(){lobby.card_down(id)};

		this.table_rating_hl=new PIXI.Sprite(assets.table_rating_hl);
		this.table_rating_hl.width=200;
		this.table_rating_hl.height=90;

		this.avatar=new PIXI.Graphics();
		this.avatar.x=16;
		this.avatar.y=16;
		this.avatar.w=this.avatar.h=58.2;

		this.avatar_frame=new PIXI.Sprite(assets.chat_avatar_frame_img);
		this.avatar_frame.x=16-11.64;
		this.avatar_frame.y=16-11.64;
		this.avatar_frame.width=this.avatar_frame.height=81.48;

		this.name="";
		this.name_text=new PIXI.BitmapText('', {fontName: 'mfont64',fontSize: 22,align: 'center'});
		this.name_text.anchor.set(1,0);
		this.name_text.x=180;
		this.name_text.y=20;
		this.name_text.tint=0xffffff;

		this.rating=0;
		this.rating_text=new PIXI.BitmapText('', {fontName: 'mfont64',fontSize: 29,align: 'center'});
		this.rating_text.tint=0xffff00;
		this.rating_text.anchor.set(1,0.5);
		this.rating_text.x=185;
		this.rating_text.y=65;
		this.rating_text.tint=0xffff55;

		//аватар первого игрока
		this.avatar1=new PIXI.Graphics();
		this.avatar1.x=19;
		this.avatar1.y=16;
		this.avatar1.w=this.avatar1.h=58.2;

		this.avatar1_frame=new PIXI.Sprite(assets.chat_avatar_frame_img);
		this.avatar1_frame.x=this.avatar1.x-11.64;
		this.avatar1_frame.y=this.avatar1.y-11.64;
		this.avatar1_frame.width=this.avatar1_frame.height=81.48;



		//аватар второго игрока
		this.avatar2=new PIXI.Graphics();
		this.avatar2.x=121;
		this.avatar2.y=16;
		this.avatar2.w=this.avatar2.h=58.2;

		this.avatar2_frame=new PIXI.Sprite(assets.chat_avatar_frame_img);
		this.avatar2_frame.x=this.avatar2.x-11.64;
		this.avatar2_frame.y=this.avatar2.y-11.64;
		this.avatar2_frame.width=this.avatar2_frame.height=81.48;


		this.rating_text1=new PIXI.BitmapText('', {fontName: 'mfont32',fontSize: 24,align: 'center'});
		this.rating_text1.tint=0xffff00;
		this.rating_text1.anchor.set(0.5,0);
		this.rating_text1.x=48.1;
		this.rating_text1.y=56;

		this.rating_text2=new PIXI.BitmapText('', {fontName: 'mfont32',fontSize: 24,align: 'center'});
		this.rating_text2.tint=0xffff00;
		this.rating_text2.anchor.set(0.5,0);
		this.rating_text2.x=150.1;
		this.rating_text2.y=56;

		this.t_country=new PIXI.BitmapText('', {fontName: 'mfont32',fontSize: 25,align: 'center'});
		this.t_country.tint=0xffff00;
		this.t_country.anchor.set(1,0.5);
		this.t_country.x=100;
		this.t_country.y=60;
		this.t_country.tint=0xaaaa99;

		this.name1="";
		this.name2="";

		this.addChild(this.bcg,this.avatar,this.avatar_frame,this.avatar1, this.avatar1_frame, this.avatar2,this.avatar2_frame,this.rating_text,this.table_rating_hl,this.rating_text1,this.rating_text2, this.name_text,this.t_country);
	}

}

class feedback_record_class extends PIXI.Container {

	constructor() {

		super();
		this.text=new PIXI.BitmapText('Николай: хорошая игра', {lineSpacing:50,fontName: 'mfont32',fontSize: 20,align: 'left'});
		this.text.maxWidth=290;
		this.text.tint=0xFFFF00;

		this.name_text=new PIXI.BitmapText('Николай:', {fontName: 'mfont32',fontSize: 20,align: 'left'});
		this.name_text.tint=0xFFFFFF;


		this.addChild(this.text,this.name_text)
	}

	set(name, feedback_text){
		this.text.text=name+': '+feedback_text;
		this.name_text.text=name+':';

	}


}

class cell_class extends PIXI.Container{

	constructor(x,y){
		super()
		this.x=x
		this.y=y

		this.bcg=new PIXI.Sprite()
		this.bcg.anchor.set(0.5,0.5)
		this.bcg.width=70
		this.bcg.height=70

		this.city_name = new PIXI.BitmapText('City', {fontName: 'mfont32',fontSize: 16});
		this.city_name.anchor.set(0.5,0.5);
		this.city_name.y=-17;
		this.city_name.tint=0xFBE5D6;

		this.level_icon=new PIXI.Sprite()
		this.level_icon.anchor.set(0.5,0.5)
		this.level_icon.y=5
		this.level_icon.scale_xy=0.7
		//this.level_icon.alpha=0.4

		this.auc_icon=new PIXI.Sprite(assets.auc_icon)
		this.auc_icon.anchor.set(0.5,0.5)
		this.auc_icon.y=-1
		this.auc_icon.scale_xy=0.4
		this.auc_icon.visible=false


		this.icon=new PIXI.Sprite(assets.q_icon)
		this.icon.anchor.set(0.5,0.5)
		this.icon.width=60
		this.icon.height=60
		this.icon.visible=false

		this.price = new PIXI.BitmapText('0$', {fontName: 'mfont32',fontSize: 15});
		this.price.anchor.set(0.5,0.5);
		this.price.y=17;
		this.price.tint=0xFBE5FF;
		
		this.hl=new PIXI.Sprite(assets.cell_hl_img)
		this.hl.anchor.set(0.5,0.5)
		this.hl.width=90
		this.hl.height=90
		this.hl.visible=false
		
		this.addChild(this.bcg,this.auc_icon,this.level_icon,this.icon,this.city_name,this.price,this.hl)
	}


}

req_dialog={

	_opp_data : {} ,

	async show(msg) {

		//если нет в кэше то загружаем из фб
		const uid=msg.s
		await players_cache.update(uid);
		await players_cache.update_avatar(uid);

		const player=players_cache.players[uid];

		sound.play('receive_sticker');

		anim3.add(objects.req_cont,{y:[-260, objects.req_cont.sy,'easeOutElastic']}, true, 0.75);

		//Отображаем  имя и фамилию в окне приглашения
		req_dialog._opp_data.uid=uid;
		req_dialog._opp_data.name=player.name;
		req_dialog._opp_data.rating=player.rating;

		objects.req_name.set2(player.name,200);
		objects.req_rating.text=player.rating;

		objects.req_avatar.set_texture(player.texture);

	},

	reject() {

		if (objects.req_cont.ready===false || objects.req_cont.visible===false)
			return;

		sound.play('close_it');

		anim3.add(objects.req_cont,{y:[objects.req_cont.sy, -260,'easeInBack']}, false, 0.5);

		fbs.ref('inbox/'+req_dialog._opp_data.uid).push({s:my_data.uid,m:"REJECT",tm:Date.now()});
	},

	accept() {

		if (anim3.any_on()||!objects.req_cont.visible) {
			sound.play('locked');
			return;
		}

		//устанавливаем окончательные данные оппонента
		opp_data = req_dialog._opp_data;

		anim3.add(objects.req_cont,{y:[objects.req_cont.sy, -260,'easeInBack']}, false, 0.5);


		//отправляем информацию о согласии играть с идентификатором игры и сидом
		game_id=irnd(1,9999);
		const seed = irnd(1,9999);
		fbs.ref('inbox/'+opp_data.uid).push({s:my_data.uid,m:'ACCEPT',tm:Date.now(),game_id,seed});

		main_menu.close();
		lobby.close();
		online_game.activate(seed,1);

	},

	hide() {

		//если диалог не открыт то ничего не делаем
		if (objects.req_cont.ready === false || objects.req_cont.visible === false)
			return;

		anim3.add(objects.req_cont,{y:[objects.req_cont.sy, -260,'easeInBack']}, false, 0.5);

	}

}

chat={

	last_record_end : 0,
	drag : false,
	data:[],
	touch_y:0,
	drag_chat:false,
	drag_sx:0,
	drag_sy:-999,
	recent_msg:[],
	moderation_mode:0,
	block_next_click:0,
	kill_next_click:0,
	delete_message_mode:0,
	games_to_chat:200,
	payments:0,
	processing:0,
	remote_socket:0,
	ss:[],

	activate() {

		anim3.add(objects.chat_cont,{alpha:[0, 1,'linear']}, true, 0.1);
		//objects.bcg.texture=assets.lobby_bcg;
		objects.chat_enter_btn.visible=true;//my_data.games>=this.games_to_chat;

		if(my_data.blocked)
			objects.chat_enter_btn.texture=assets.chat_blocked_img;
		else
			objects.chat_enter_btn.texture=assets.chat_enter_img;

		objects.chat_rules.text='Правила чата!\n1. Будьте вежливы: Общайтесь с другими игроками с уважением. Избегайте угроз, грубых выражений, оскорблений, конфликтов.\n2. Отправлять сообщения в чат могут игроки сыгравшие более 200 онлайн партий.\n3. За нарушение правил игрок может попасть в черный список.'
		if(my_data.blocked) objects.chat_rules.text='Вы не можете писать в чат, так как вы находитесь в черном списке';

		this.shift(-2000);
	},

	new_message(data){

		console.log('new_data',data);

	},

	async init(){

		this.last_record_end = 0;
		objects.chat_msg_cont.y = objects.chat_msg_cont.sy;
		objects.bcg.interactive=true;
		objects.bcg.pointermove=this.pointer_move.bind(this);
		objects.bcg.pointerdown=this.pointer_down.bind(this);
		objects.bcg.pointerup=this.pointer_up.bind(this);
		objects.bcg.pointerupoutside=this.pointer_up.bind(this);

		for(let rec of objects.chat_records) {
			rec.visible = false;
			rec.msg_id = -1;
			rec.tm=0;
		}

		this.init_yandex_payments();

		await my_ws.init();

		//загружаем чат
		const chat_data=await my_ws.get('chat',25);

		await this.chat_load(chat_data);

		//подписываемся на новые сообщения
		my_ws.ss_child_added('chat',chat.chat_updated.bind(chat))

		console.log('Чат загружен!')
	},

	init_yandex_payments(){

		if (game_platform!=='YANDEX') return;

		if(this.payments) return;


	},

	get_oldest_index () {

		let oldest = {tm:9671801786406 ,visible:true};
		for(let rec of objects.chat_records)
			if (rec.tm < oldest.tm)
				oldest = rec;
		return oldest.index;

	},

	get_oldest_or_free_msg () {

		//проверяем пустые записи чата
		for(let rec of objects.chat_records)
			if (!rec.visible)
				return rec;

		//если пустых нет то выбираем самое старое
		let oldest = {tm:9671801786406};
		for(let rec of objects.chat_records)
			if (rec.visible===true && rec.tm < oldest.tm)
				oldest = rec;
		return oldest;

	},

	async block_player(uid){

		fbs.ref('blocked/'+uid).set(Date.now());
		fbs.ref('inbox/'+uid).push({m:'CHAT_BLOCK',tm:Date.now()});

		//увеличиваем количество блокировок
		fbs.ref('players/'+uid+'/block_num').transaction(val=> {return (val || 0) + 1});

		//сообщаем в чат
		const name=await fbs_once(`players/${uid}/name`);
		const msg=`Игрок ${name} занесен в черный список.`;
		my_ws.socket.send(JSON.stringify({cmd:'push',path:'chat',val:{uid:'admin',name:'Админ',msg,tm:'TMS'}}));
	},

	async chat_load(data) {

		if (!data) return;

		//превращаем в массив
		data = Object.keys(data).map((key) => data[key]);

		//сортируем сообщения от старых к новым
		data.sort(function(a, b) {	return a.tm - b.tm;});

		//покаываем несколько последних сообщений
		for (let c of data)
			await this.chat_updated(c,true);
	},

	async chat_updated(data, first_load) {

		//console.log('chat_updated:',JSON.stringify(data).length);
		if(data===undefined||!data.msg||!data.name||!data.uid) return;

		//ждем пока процессинг пройдет
		for (let i=0;i<10;i++){
			if (this.processing)
				await new Promise(resolve => setTimeout(resolve, 250));
			else
				break;
		}
		if (this.processing) return;

		this.processing=1;

		//выбираем номер сообщения
		const new_rec=this.get_oldest_or_free_msg();
		const y_shift=await new_rec.set(data);
		new_rec.y=this.last_record_end;

		this.last_record_end += y_shift;

		if (!first_load)
			lobby.inst_message(data);

		//смещаем на одно сообщение (если чат не видим то без твина)
		if (objects.chat_cont.visible)
			await anim3.add(objects.chat_msg_cont,{y:[objects.chat_msg_cont.y,objects.chat_msg_cont.y-y_shift,'linear']},true, 0.05);
		else
			objects.chat_msg_cont.y-=y_shift

		this.processing=0;

	},

	avatar_down(player_data){

		if (this.moderation_mode){
			console.log(player_data.index,player_data.uid,player_data.name.text,player_data.msg.text);
			fbs_once('players/'+player_data.uid+'/games').then((data)=>{
				console.log('сыграно игр: ',data)
			})
		}

		if (this.block_next_click){
			this.block_player(player_data.uid);
			console.log('Игрок заблокирован: ',player_data.uid);
			this.block_next_click=0;
		}

		if (this.kill_next_click){
			fbs.ref('inbox/'+player_data.uid).push({m:'CLIEND_ID',tm:Date.now(),client_id:999999});
			console.log('Игрок убит: ',player_data.uid);
			this.kill_next_click=0;
		}

		if(this.delete_message_mode){
			fbs.ref(`${chat_path}/${player_data.index}`).remove();
			console.log(`сообщение ${player_data.index} удалено`)
		}


		if(this.moderation_mode||this.block_next_click||this.kill_next_click||this.delete_message_mode) return;

		if (objects.chat_keyboard_cont.visible)
			keyboard.response_message(player_data.uid,player_data.name.text);
		else
			lobby.show_invite_dialog_from_chat(player_data.uid,player_data.name.text);


	},

	get_abs_top_bottom(){

		let top_y=999999;
		let bot_y=-999999
		for(let rec of objects.chat_records){
			if (rec.visible===true){
				const cur_abs_top=objects.chat_msg_cont.y+rec.y;
				const cur_abs_bot=objects.chat_msg_cont.y+rec.y+rec.height;
				if (cur_abs_top<top_y) top_y=cur_abs_top;
				if (cur_abs_bot>bot_y) bot_y=cur_abs_bot;
			}
		}

		return [top_y,bot_y];

	},

	back_btn_down(){

		if (anim3.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('click');
		this.close();
		lobby.activate();

	},

	pointer_move(e){

		if (!this.drag_chat) return;
		const mx = e.data.global.x/app.stage.scale.x;
		const my = e.data.global.y/app.stage.scale.y;

		const dy=my-this.drag_sy;
		this.drag_sy=my;

		this.shift(dy);

	},

	pointer_down(e){

		const px=e.data.global.x/app.stage.scale.x;
		this.drag_sy=e.data.global.y/app.stage.scale.y;

		this.drag_chat=true;
		objects.chat_cont.by=objects.chat_cont.y;

	},

	pointer_up(){

		this.drag_chat=false;

	},

	shift(dy) {

		const [top_y,bot_y]=this.get_abs_top_bottom();

		//проверяем движение чата вверх
		if (dy<0){
			const new_bottom=bot_y+dy;
			const overlap=435-new_bottom;
			if (new_bottom<435) dy+=overlap;
		}

		//проверяем движение чата вниз
		if (dy>0){
			const new_top=top_y+dy;
			if (new_top>50)
				return;
		}

		objects.chat_msg_cont.y+=dy;

	},

	wheel_event(delta) {

		this.shift(-delta*30)

	},

	make_hash() {
	  let hash = '';
	  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	  for (let i = 0; i < 6; i++) {
		hash += characters.charAt(Math.floor(Math.random() * characters.length));
	  }
	  return hash;
	},

	async write_btn_down(){

		if (anim3.any_on()) {
			sound.play('locked');
			return
		};

		//оплата разблокировки чата
		if (my_data.blocked){

			let block_num=await fbs_once('players/'+my_data.uid+'/block_num');
			block_num=block_num||1;
			block_num=Math.min(6,block_num);

			if(game_platform==='YANDEX'){

				this.payments.purchase({ id: 'unblock'+block_num}).then(purchase => {
					this.unblock_chat();
				}).catch(err => {
					message.add('Ошибка при покупке!');
				})
			}

			if (game_platform==='VK') {

				vkBridge.send('VKWebAppShowOrderBox', { type: 'item', item: 'unblock'+block_num}).then(data =>{
					this.unblock_chat();
				}).catch((err) => {
					message.add('Ошибка при покупке!');
				});

			};

			return;
		}

		sound.play('click');

		//убираем метки старых сообщений
		const cur_dt=Date.now();
		this.recent_msg = this.recent_msg.filter(d =>cur_dt-d<60000);

		if (this.recent_msg.length>3){
			sys_msg.add('Подождите 1 минуту')
			return;
		}

		//добавляем отметку о сообщении
		this.recent_msg.push(Date.now());

		//пишем сообщение в чат и отправляем его
		const msg = await keyboard.read(70);
		if (msg) {
			const index=irnd(1,999);
			my_ws.safe_send({cmd:'push',path:'chat',val:{uid:my_data.uid,name:my_data.name,msg,tm:'TMS'}})
			//fbs.ref(chat_path+'/'+index).push({uid:my_data.uid,name:my_data.name,msg, tm:firebase.database.ServerValue.TIMESTAMP,index});
		}

	},

	unblock_chat(){
		objects.chat_rules.text='Правила чата!\n1. Будьте вежливы: Общайтесь с другими игроками с уважением. Избегайте угроз, грубых выражений, оскорблений, конфликтов.\n2. Отправлять сообщения в чат могут игроки сыгравшие более 200 онлайн партий.\n3. За нарушение правил игрок может попасть в черный список.'
		objects.chat_enter_btn.texture=assets.chat_enter_img;
		fbs.ref('blocked/'+my_data.uid).remove();
		my_data.blocked=0;
		message.add('Вы разблокировали чат');
		sound.play('mini_dialog');
	},

	close() {

		anim3.add(objects.chat_cont,{alpha:[1, 0,'linear']}, false, 0.1);
		if (objects.chat_keyboard_cont.visible)
			keyboard.close();
	}

}

sound={

	on : 1,

	play(snd_res,is_loop,volume) {

		if (!this.on||document.hidden)
			return;

		if (!assets[snd_res])
			return;

		assets[snd_res].play({loop:is_loop||false,volume:volume||1});

	},

}

music={

	on:1

}

process_new_message = function(msg) {

	//проверяем плохие сообщения
	if (msg===null || msg===undefined)
		return;

	//принимаем только положительный ответ от соответствующего соперника и начинаем игру
	if (msg.m==='ACCEPT'  && pending_player===msg.s && state !== "p") {
		//в данном случае я мастер и хожу вторым
		opp_data.uid=msg.s
		game_id=msg.game_id
		lobby.accepted_invite(msg)
	}

	//принимаем также отрицательный ответ от соответствующего соперника
	if (msg.m==='REJECT'  && pending_player === msg.s) {
		lobby.rejected_invite();
	}

	//айди клиента для удаления дубликатов
	if (msg.m==='CLIEND_ID')
		if (msg.client_id !== client_id)
			kill_game()


	//получение сообщение в состояни игры
	if (state==='p') {

		//учитываем только сообщения от соперника
		if (msg.s===opp_data.uid) {

			//получение отказа от игры
			if (msg.m==='REFUSE')
				confirm_dialog.opponent_confirm_play(0);

			//получение согласия на игру
			if (msg.m==='CONF')
				confirm_dialog.opponent_confirm_play(1);

			//получение стикера
			if (msg.m==='STCR')
				stickers.receive(msg.data);

			//получение сообщение с сдаче
			if (msg.m==='END')
				common.stop('opp_giveup');
			
			if (['auc_bid','auc_buy','auc_dec','auc_dec2','auc_giveup'].includes(msg.type))
				auc.opp_bid(msg);

			if (['exch','plan','exch_decline','exch_approve','buy','sell','fin','roll','casino_accept','casino_decline','casino_result'].includes(msg.type))
				common.process_opp_move(msg);

			//получение сообщение с ходом игорка
			if (msg.m==='CHAT')
				online_game.chat(msg.data);

			//соперник отключил чат
			if (msg.m==='NOCHAT')
				online_game.nochat();
		}
	}

	//приглашение поиграть
	if(state==='o'||state==='b') {

		if (msg.m==='INV') {
			req_dialog.show(msg);
		}

		if (msg.m==='INV_REM') {
			//запрос игры обновляет данные оппонента поэтому отказ обрабатываем только от актуального запроса
			if (msg.s === req_dialog._opp_data.uid)
				req_dialog.hide(msg.s);
		}

	}

}

sys_msg={

	promise_resolve :0,

	async add(t){

		if (this.promise_resolve) {
			console.log('this.promise_resolve("forced")')
			this.promise_resolve('forced');
		}

		sound.play('popup');

		//показываем сообщение
		objects.sys_msg_text.text=t;
		const ares=await anim3.add(objects.sys_msg_cont,{alpha:[0,1,'linear']}, true, 0.25,false);
		if (ares===2) {
			return;
		}

		//ждем
		const res = await new Promise(resolve => {
				sys_msg.promise_resolve = resolve;
				setTimeout(resolve,5000)
			}
		)
		sys_msg.promise_resolve=0

		//это если насильно закрываем
		if (res==='forced'){
			return;
		} 

		anim3.add(objects.sys_msg_cont,{alpha:[1,0,'linear']}, false, 0.25,false);

	},
	
	close(){
		
		if (this.promise_resolve) {
			console.log('this.promise_resolve("forced")')
			this.promise_resolve('forced');
		}
		objects.sys_msg_cont.visible=false
		
	}

}

message={

	promise_resolve :0,

	async add(data={text:'---', timeout:3000,sound_name:'online_message',sender:'me'}) {

		if (this.promise_resolve!==0) this.promise_resolve('forced');

		//воспроизводим звук
		sound.play(data.sound_name);

		objects.message_text.text=data.text;

		await anim3.add(objects.message_cont,{alpha:[0,1,'linear']}, true, 0.25,false);

		const res = await new Promise((resolve, reject) => {
				message.promise_resolve = resolve;
				setTimeout(resolve, data.timeout)
			}
		);

		//это если насильно закрываем
		if (res==='forced') return;

		anim3.add(objects.message_cont,{alpha:[1, 0,'linear']}, false, 0.25,false);
	},

	clicked() {


		message.promise_resolve();

	}

}

game_msgs={
	
	
	activate(){
	
		objects.game_msgs_cont.y=objects.game_msgs_cont.sy
		for (let i=0;i<objects.game_msgs.length;i++){
			objects.game_msgs[i].y=i*15
			objects.game_msgs[i].text=''
		}

		
	},
	
	add(t){
		
		if (!objects.game_msgs_cont.ready){
			setTimeout(()=>{this.add(t)},100)
			return
		}
		objects.game_msgs.forEach(m=>m.alpha=0.7)
		anim3.add(objects.game_msgs_cont,{y:[objects.game_msgs_cont.y, objects.game_msgs_cont.y+15,'linear']}, true, 0.25);
		const last_rec=this.get_last_rec()
		last_rec.y-=60
		last_rec.text=t
		last_rec.alpha=1
		
	},
	
	get_last_rec(){
		
		let last_rec=objects.game_msgs[0]
		for (let i=0;i<objects.game_msgs.length;i++)
			if (objects.game_msgs[i].y>last_rec.y)
				last_rec=objects.game_msgs[i]
		return last_rec
	}
	
	
	
}

stickers={

	promise_resolve_send :0,
	promise_resolve_recive :0,

	show_panel() {

		if (anim3.any_on()||objects.stickers_cont.visible) {
			sound.play('locked');
			return
		};

		if (!objects.stickers_cont.ready) return;
		sound.play('click');

		//ничего не делаем если панель еще не готова
		if (!objects.stickers_cont.ready||objects.stickers_cont.visible||state!=='p') return;

		//анимационное появление панели стикеров
		anim3.add(objects.stickers_cont,{y:[450, objects.stickers_cont.sy,'easeOutBack']}, true, 0.5);

	},

	hide_panel() {

		sound.play('close');

		if (objects.stickers_cont.ready===false)
			return;

		//анимационное появление панели стикеров
		anim3.add(objects.stickers_cont,{y:[objects.stickers_cont.sy, -450,'easeInBack']}, false, 0.5);

	},

	async send(id) {

		if (objects.stickers_cont.ready===false)
			return;

		if (this.promise_resolve_send!==0)
			this.promise_resolve_send("forced");

		this.hide_panel();

		fbs.ref('inbox/'+opp_data.uid).push({s:my_data.uid,m:'STCR',tm:Date.now(),data:id});
		
		sys_msg.add('Вы отправили стикер!')

		const res = await new Promise((resolve, reject) => {
				stickers.promise_resolve_send = resolve;
				setTimeout(resolve, 5000)
			}
		);

		if (res === 'forced') return;

		//anim3.add(objects.sent_sticker_area,{alpha:[0.8, 0,'linear']}, false, 0.5);
	},

	async receive(id) {


		if (this.promise_resolve_recive!==0)
			this.promise_resolve_recive('forced');

		//воспроизводим соответствующий звук
		sound.play('receive_sticker');

		objects.rec_sticker_area.texture=assets['sticker_texture_'+id];

		await anim3.add(objects.rec_sticker_area,{alpha:[0, 0.8,'linear']}, true, 0.5);

		const res = await new Promise((resolve, reject) => {
				stickers.promise_resolve_recive = resolve;
				setTimeout(resolve, 5000)
			}
		);

		if (res === 'forced') return;

		anim3.add(objects.rec_sticker_area,{alpha:[0.8, 0,'easeInBack']}, false, 0.5);

	}

}

function resize() {
    const vpw = window.innerWidth;  // Width of the viewport
    const vph = window.innerHeight; // Height of the viewport
    let nvw; // New game width
    let nvh; // New game height

    if (vph / vpw < M_HEIGHT / M_WIDTH) {
      nvh = vph;
      nvw = (nvh * M_WIDTH) / M_HEIGHT;
    } else {
      nvw = vpw;
      nvh = (nvw * M_HEIGHT) / M_WIDTH;
    }
    app.renderer.resize(nvw, nvh);
    app.stage.scale.set(nvw / M_WIDTH, nvh / M_HEIGHT);
}

function set_state(params) {

	if (params.state!==undefined)
		state=params.state;

	if (params.hidden!==undefined)
		hidden=+params.hidden;

	let small_opp_id="";
	if (opp_data.uid!==undefined)
		small_opp_id=opp_data.uid.substring(0,10);

	fbs.ref(room_name+'/'+my_data.uid).set({state:state, name:my_data.name, rating : my_data.rating, hidden, opp_id : small_opp_id, game_id});

}

confirm_dialog = {

	p_resolve : 0,

	show(msg) {

		if (objects.confirm_cont.visible === true) {
			sound.play('locked')
			return;
		}

		sound.play("confirm_dialog");

		objects.confirm_msg.text=msg;

		anim3.add(objects.confirm_cont,{alpha:[0, 1,'linear'],scale_xy:[1,1.1,'ease2back']}, true, 0.2)

		return new Promise(function(resolve, reject){
			confirm_dialog.p_resolve = resolve;
		});
	},

	button_down(res) {

		if (anim3.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('click')

		this.close();
		this.p_resolve(res);

	},

	close () {
		anim3.add(objects.confirm_cont,{scale_xy:[1,0.5,'easeInBack'],alpha:[1,0,'linear']}, false, 0.5);
	}

}

keyboard={

	ru_keys:[[49,122.05,79,161.12,'1'],[89,122.05,119,161.12,'2'],[129,122.05,159,161.12,'3'],[169,122.05,199,161.12,'4'],[209,122.05,239,161.12,'5'],[249,122.05,279,161.12,'6'],[289,122.05,319,161.12,'7'],[329,122.05,359,161.12,'8'],[369,122.05,399,161.12,'9'],[409,122.05,439,161.12,'0'],[490,122.05,540,161.12,'<'],[69,170.88,99,209.95,'Й'],[109,170.88,139,209.95,'Ц'],[149,170.88,179,209.95,'У'],[189,170.88,219,209.95,'К'],[229,170.88,259,209.95,'Е'],[269,170.88,299,209.95,'Н'],[309,170.88,339,209.95,'Г'],[349,170.88,379,209.95,'Ш'],[389,170.88,419,209.95,'Щ'],[429,170.88,459,209.95,'З'],[469,170.88,499,209.95,'Х'],[509,170.88,539,209.95,'Ъ'],[89,219.72,119,258.79,'Ф'],[129,219.72,159,258.79,'Ы'],[169,219.72,199,258.79,'В'],[209,219.72,239,258.79,'А'],[249,219.72,279,258.79,'П'],[289,219.72,319,258.79,'Р'],[329,219.72,359,258.79,'О'],[369,219.72,399,258.79,'Л'],[409,219.72,439,258.79,'Д'],[449,219.72,479,258.79,'Ж'],[489,219.72,519,258.79,'Э'],[69,268.56,99,307.63,'!'],[109,268.56,139,307.63,'Я'],[149,268.56,179,307.63,'Ч'],[189,268.56,219,307.63,'С'],[229,268.56,259,307.63,'М'],[269,268.56,299,307.63,'И'],[309,268.56,339,307.63,'Т'],[349,268.56,379,307.63,'Ь'],[389,268.56,419,307.63,'Б'],[429,268.56,459,307.63,'Ю'],[510,268.56,540,307.63,')'],[450,122.05,480,161.12,'?'],[29,317.4,179,356.47,'ЗАКРЫТЬ'],[189,317.4,419,356.47,' '],[429,317.4,569,356.47,'ОТПРАВИТЬ'],[530,219.72,560,258.79,','],[470,268.56,500,307.63,'('],[29,219.72,79,258.79,'EN']],
	en_keys:[[51,120.58,81,159.65,'1'],[91,120.58,121,159.65,'2'],[131,120.58,161,159.65,'3'],[171,120.58,201,159.65,'4'],[211,120.58,241,159.65,'5'],[251,120.58,281,159.65,'6'],[291,120.58,321,159.65,'7'],[331,120.58,361,159.65,'8'],[371,120.58,401,159.65,'9'],[411,120.58,441,159.65,'0'],[492,120.58,542,159.65,'<'],[111,169.42,141,208.49,'Q'],[151,169.42,181,208.49,'W'],[191,169.42,221,208.49,'E'],[231,169.42,261,208.49,'R'],[271,169.42,301,208.49,'T'],[311,169.42,341,208.49,'Y'],[351,169.42,381,208.49,'U'],[391,169.42,421,208.49,'I'],[431,169.42,461,208.49,'O'],[471,169.42,501,208.49,'P'],[131,218.26,161,257.33,'A'],[171,218.26,201,257.33,'S'],[211,218.26,241,257.33,'D'],[251,218.26,281,257.33,'F'],[291,218.26,321,257.33,'G'],[331,218.26,361,257.33,'H'],[371,218.26,401,257.33,'J'],[411,218.26,441,257.33,'K'],[451,218.26,481,257.33,'L'],[472,267.09,502,306.16,'('],[71,267.09,101,306.16,'!'],[151,267.09,181,306.16,'Z'],[191,267.09,221,306.16,'X'],[231,267.09,261,306.16,'C'],[271,267.09,301,306.16,'V'],[311,267.09,341,306.16,'B'],[351,267.09,381,306.16,'N'],[391,267.09,421,306.16,'M'],[512,267.09,542,306.16,')'],[452,120.58,482,159.65,'?'],[31,315.93,181,355,'CLOSE'],[191,315.93,421,355,' '],[431,315.93,571,355,'SEND'],[532,218.26,562,257.33,','],[31,218.26,81,257.33,'RU']],
	layout:0,
	resolver:0,

	MAX_SYMBOLS : 60,

	read(max_symb){

		this.MAX_SYMBOLS=max_symb||60;
		if (!this.layout)this.switch_layout();

		//если какой-то ресолвер открыт
		if(this.resolver) this.resolver('');

		objects.chat_keyboard_text.text ='';
		objects.chat_keyboard_control.text = `0/${this.MAX_SYMBOLS}`

		anim3.add(objects.chat_keyboard_cont,{y:[450, objects.chat_keyboard_cont.sy,'linear']}, true, 0.2)


		return new Promise(resolve=>{
			this.resolver=resolve;
		})

	},

	keydown (key) {

		//*******это нажатие с клавиатуры
		if(!objects.chat_keyboard_cont.visible) return;

		key = key.toUpperCase();

		if(key==='BACKSPACE') key ='<';
		if(key==='ENTER') key ='ОТПРАВИТЬ';
		if(key==='ESCAPE') key ='ЗАКРЫТЬ';

		var key2 = this.layout.find(k => {return k[4] === key})

		this.process_key(key2)

	},

	get_key_from_touch(e){

		//координаты нажатия в плостоки спрайта клавиатуры
		let mx = e.data.global.x/app.stage.scale.x - objects.chat_keyboard_cont.x-10;
		let my = e.data.global.y/app.stage.scale.y - objects.chat_keyboard_cont.y-10;

		//ищем попадание нажатия на кнопку
		let margin = 5;
		for (let k of this.layout)
			if (mx > k[0] - margin && mx <k[2] + margin  && my > k[1] - margin && my < k[3] + margin)
				return k;
		return null;
	},

	highlight_key(key_data){

		const [x,y,x2,y2,key]=key_data

		//подсвечиваем клавишу
		objects.chat_keyboard_hl.width=x2-x+20;
		objects.chat_keyboard_hl.height=y2-y+20;

		objects.chat_keyboard_hl.x = x+objects.chat_keyboard.x-10;
		objects.chat_keyboard_hl.y = y+objects.chat_keyboard.y-10;

		anim3.add(objects.chat_keyboard_hl,{alpha:[1, 0,'linear']}, false, 0.5);

	},

	pointerdown (e) {

		//if (!game.on) return;

		//получаем значение на которое нажали
		const key=this.get_key_from_touch(e);

		//дальнейшая обработка нажатой команды
		this.process_key(key);
	},

	response_message(uid, name) {

		objects.chat_keyboard_text.text = name.split(' ')[0]+', ';
		objects.chat_keyboard_control.text = `${objects.chat_keyboard_text.text.length}/${keyboard.MAX_SYMBOLS}`

	},

	switch_layout(){

		if (this.layout===this.ru_keys){
			this.layout=this.en_keys;
			objects.chat_keyboard.texture=assets.eng_layout;
		}else{
			this.layout=this.ru_keys;
			objects.chat_keyboard.texture=assets.rus_layout;
		}

	},

	process_key(key_data){

		if(!key_data) return;

		let key=key_data[4];

		//звук нажатой клавиши
		sound.play('keypress');

		const t=objects.chat_keyboard_text.text;
		if ((key==='ОТПРАВИТЬ'||key==='SEND')&&t.length>0){
			this.resolver(t);
			this.close();
			key ='';
		}

		if (key==='ЗАКРЫТЬ'||key==='CLOSE'){
			this.resolver(0);
			this.close();
			key ='';
		}

		if (key==='RU'||key==='EN'){
			this.switch_layout();
			key ='';
		}

		if (key==='<'){
			objects.chat_keyboard_text.text=t.slice(0, -1);
			key ='';
		}

		if (t.length>=this.MAX_SYMBOLS) return;

		//подсвечиваем...
		this.highlight_key(key_data);

		//добавляем значение к слову
		if (key.length===1) objects.chat_keyboard_text.text+=key;

		objects.chat_keyboard_control.text = `${objects.chat_keyboard_text.text.length}/${this.MAX_SYMBOLS}`

	},

	close () {

		//на всякий случай уничтожаем резолвер
		if (this.resolver) this.resolver(0);
		anim3.add(objects.chat_keyboard_cont,{y:[objects.chat_keyboard_cont.y,450,'linear']}, false, 0.2);

	},

}

auth2={

	load_script(src) {
	  return new Promise((resolve, reject) => {
		const script = document.createElement('script')
		script.type = 'text/javascript'
		script.onload = resolve
		script.onerror = reject
		script.src = src
		document.head.appendChild(script)
	  })
	},

	get_random_char() {

		const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
		return chars[irnd(0,chars.length-1)];

	},

	get_random_uid_for_local (prefix) {

		let uid = prefix;
		for ( let c = 0 ; c < 12 ; c++ )
			uid += this.get_random_char();

		//сохраняем этот uid в локальном хранилище
		try {
			localStorage.setItem('poker_uid', uid);
		} catch (e) {alert(e)}

		return uid;

	},

	get_random_name (uid) {

		const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
		const rnd_names = ['Gamma','Chime','Dron','Perl','Onyx','Asti','Wolf','Roll','Lime','Cosy','Hot','Kent','Pony','Baker','Super','ZigZag','Magik','Alpha','Beta','Foxy','Fazer','King','Kid','Rock'];

		if (uid !== undefined) {

			let e_num1 = chars.indexOf(uid[3]) + chars.indexOf(uid[4]) + chars.indexOf(uid[5]) + chars.indexOf(uid[6]);
			e_num1 = Math.abs(e_num1) % (rnd_names.length - 1);
			let name_postfix = chars.indexOf(uid[7]).toString() + chars.indexOf(uid[8]).toString() + chars.indexOf(uid[9]).toString() ;
			return rnd_names[e_num1] + name_postfix.substring(0, 3);

		} else {

			let rnd_num = irnd(0, rnd_names.length - 1);
			let rand_uid = irnd(0, 999999)+ 100;
			let name_postfix = rand_uid.toString().substring(0, 3);
			let name =	rnd_names[rnd_num] + name_postfix;
			return name;
		}
	},

	async get_country_code() {

		let country_code = ''
		try {
			let resp1 = await fetch("https://ipinfo.io/json?token=63f43de65702b8");
			let resp2 = await resp1.json();
			country_code = resp2.country || '';
		} catch(e){}

		return country_code;

	},

	async get_country_code2() {

		let country_code = ''
		try {
			let resp1 = await fetch("https://api.ipgeolocation.io/ipgeo?apiKey=1efc1ba695434f2ab24129a98a72a1d4");
			let resp2 = await resp1.json();
			country_code = resp2.country_code2 || '';
		} catch(e){}

		return country_code;

	},

	search_in_local_storage () {

		//ищем в локальном хранилище
		let local_uid = null;

		try {
			local_uid = localStorage.getItem('poker_uid');
		} catch (e) {alert(e)}

		if (local_uid !== null) return local_uid;

		return undefined;

	},

	async init() {

		if (game_platform === 'YANDEX') {

			async function initSDK() {
				try {
					await new Promise((resolve, reject) => {
						var s = document.createElement('script');
						s.src = "https://sdk.games.s3.yandex.net/sdk.js";
						s.async = true;
						s.onload = resolve;
						s.onerror = reject;
						document.body.appendChild(s);
					});
					console.log("SDK loaded successfully");
				} catch (error) {
					console.error("Failed to load SDK:", error);
				}
			}

			await initSDK();

			let _player;

			try {
				window.ysdk = await YaGames.init({});
				_player = await window.ysdk.getPlayer();
			} catch (e) { alert(e)};

			my_data.uid = _player.getUniqueID().replace(/[\/+=]/g, '');
			my_data.name = _player.getName();
			my_data.orig_pic_url = _player.getPhoto('medium');

			if (my_data.orig_pic_url === 'https://games-sdk.yandex.ru/games/api/sdk/v1/player/avatar/0/islands-retina-medium')
				my_data.orig_pic_url = 'mavatar'+my_data.uid;

			if (my_data.name === '')
				my_data.name = this.get_random_name(my_data.uid);

			//выбор языка по яндексу
			LANG=window.ysdk.environment.i18n.lang==='ru'?0:1;

			//загружаем покупки
			window.ysdk.getPayments({ signed: true }).then(_payments => {
				yndx_payments = _payments;
			}).catch(err => {
				alert('Ошибка при загрузке покупок!')
			})

			return;
		}

		if (game_platform === 'VK') {

			try {
				await this.load_script('https://unpkg.com/@vkontakte/vk-bridge/dist/browser.min.js')||await this.load_script('https://akukamil.github.io/common/vkbridge.js');
			} catch (e) {alert(e)};

			let _player;

			try {
				await vkBridge.send('VKWebAppInit');
				_player = await vkBridge.send('VKWebAppGetUserInfo');
			} catch (e) {alert(e)};


			my_data.name 	= _player.first_name + ' ' + _player.last_name;
			my_data.uid 	= 'vk'+_player.id;
			my_data.orig_pic_url = _player.photo_100;

			return;

		}

		if (game_platform === 'GOOGLE_PLAY') {

			my_data.uid = this.search_in_local_storage() || this.get_random_uid_for_local('GP_');
			my_data.name = this.get_random_name(my_data.uid);
			my_data.orig_pic_url = 'mavatar'+my_data.uid;
			return;
		}

		if (game_platform === 'DEBUG') {

			my_data.name = my_data.uid = 'debug' + prompt('Отладка. Введите ID', 100);
			my_data.orig_pic_url = 'mavatar'+my_data.uid;
			return;
		}

		if (game_platform === 'UNKNOWN') {

			//если не нашли платформу
			//alert('Неизвестная платформа. Кто Вы?')
			my_data.uid = this.search_in_local_storage() || this.get_random_uid_for_local('LS_');
			my_data.name = this.get_random_name(my_data.uid);
			my_data.orig_pic_url = 'mavatar'+my_data.uid;
		}
	},

	get_country_from_name(name){

		const have_country_code=/\(.{2}\)/.test(name);
		if(have_country_code)
			return name.slice(-3, -1);
		return '';

	}

}

timer={

	t:0,
	prv_tm:0,
	sec_left:0,

	start({sec=30} = {}){

		if (opponent===bot_game){
			this.just_place()
			return
		}

		clearInterval(this.t)
		this.t=setInterval(()=>this.tick(),1000)
		this.sec_left=sec
		this.prv_tm=Date.now()
		objects.timer_text.tint=objects.timer_text.base_tint
		this.update_text()
		this.just_place()

	},
		
	pause(){
		
		clearInterval(this.t)
		
	},
		
	resume(){
		
		if (opponent===bot_game) return
		
		this.prv_tm=Date.now()
		this.t=setInterval(()=>this.tick(),1000)
		
	},

	just_place(){

		objects.timer_cont.visible=true

		if (my_turn)
			objects.timer_cont.x=objects.my_card_cont.sx+objects.my_avatar.x+objects.my_avatar.width*0.5
		else
			objects.timer_cont.x=objects.opp_card_cont.sx+objects.opp_avatar.x+objects.opp_avatar.width*0.5

	},

	update_text(){

		objects.timer_text.text=(this.sec_left>9?'0:':'0:0')+Math.abs(this.sec_left)

	},

	stop(){

		clearInterval(this.t)

	},

	tick(){

		const tm=Date.now()
		if (tm-this.prv_tm>5000||tm<this.prv_tm){
			common.stop('timer_error');
		}
		this.prv_tm=tm

		this.sec_left--

		//обновляем текст на экране
		this.update_text()

		//подсветка текста
		if (this.sec_left===5) {
			objects.timer_text.tint=0xff0000
			sound.play('clock')
		}		
		
		if (this.sec_left < 0 && my_turn)	{

			if (online_game.me_conf_play)
				common.stop('my_timeout');
			else
				common.stop('my_no_sync');

			return;
		}

		if (this.sec_left < -5 && !my_turn) {

			if (online_game.opp_conf_play === 1)
				common.stop('opp_timeout');
			else
				common.stop('opp_no_sync');
			return;
		}

	}

}

pref={

	bcg_loader:null,
	avatar_switch_center:0,
	avatar_swtich_cur:0,
	avatar_changed:0,
	name_changed:0,
	tex_loading:0,
	hours_to_nick_change:999,
	hours_to_photo_change:999,

	activate(){

		//пока ничего не изменено
		this.avatar_changed=0;
		this.name_changed=0;

		//заполняем имя и аватар
		objects.pref_name.set2(my_data.name,260)
		objects.pref_avatar.set_texture(players_cache.players[my_data.uid].texture)

		//мои данные
		objects.pref_rating.text=my_data.rating
		objects.pref_games.text=['Игры: ','Games: '][LANG]+my_data.games
		
		//информация о бонусах
		objects.pref_energy_info.text=my_data.energy
		
		this.avatar_switch_center=this.avatar_swtich_cur=irnd(9999,999999)

		//обновляем кнопки
		this.update_buttons()

	},

	init(){

		let i=0
		setInterval(()=>{
			
			if(i===25) this.update_server_tm()
			if(i===6) this.check_energy2()

			i = (i + 1) % 60
			
		},1000)
		
	},
	
	change_energy(amount){
		
		if (amount===0) return
						
		my_data.energy+=amount		
		objects.pref_energy_info.text=my_data.energy
		safe_ls('domino_energy',my_data.energy)
			
		//отправляем в топ3		
		my_ws.safe_send({cmd:'top3',path:'_day_top3',val:{uid:my_data.uid,val:my_data.energy}})

	},

	getHoursEnding(hours) {
		hours = Math.abs(hours) % 100;
		let lastDigit = hours % 10;

		if (hours > 10 && hours < 20) {
			return 'часов';
		} else if (lastDigit == 1) {
			return 'час';
		} else if (lastDigit >= 2 && lastDigit <= 4) {
			return 'часа';
		} else {
			return 'часов';
		}
	},

	update_server_tm(){

		//тупо обновляем время
		my_ws.get_tms().then(t=>{
			SERVER_TM=t||SERVER_TM
		})

	},
			
	check_energy2(){
		
		//нужно удалит первую версию
		
		if(!SERVER_TM) return
		const prv_tm=safe_ls('domino_energy_prv_tm')
		
		const cur_msk_day=+new Date(SERVER_TM).toLocaleString('en-US', {timeZone: 'Europe/Moscow',day:'numeric'})
		const prv_msk_day=+new Date(prv_tm).toLocaleString('en-US', {timeZone: 'Europe/Moscow',day:'numeric'})
		
		if (cur_msk_day!==prv_msk_day){			
			
			//день поменялся начинаем заново
			my_data.energy=0		
			objects.pref_energy_info.text=my_data.energy
			safe_ls('domino_energy',my_data.energy)		

			//обновляем уникальных соперников (начиниаем с начала)
			//mp_game.unique_opps=[]
			//safe_ls(game_name+'_uo', mp_game.unique_opps)
			
		}	

		safe_ls('domino_energy_prv_tm',SERVER_TM)
	
	},
	
	update_buttons(){

		if (!SERVER_TM){
			this.send_info('Ошибка получения серверного времени(((')
			return
		}

		//сколько осталось до изменения
		this.hours_to_nick_change=Math.max(0,Math.floor(720-(SERVER_TM-my_data.nick_tm)*0.001/3600));
		this.hours_to_photo_change=Math.max(0,Math.floor(720-(SERVER_TM-my_data.avatar_tm)*0.001/3600));

		//определяем какие кнопки доступны
		objects.pref_change_name_btn.alpha=(this.hours_to_nick_change>0||my_data.games<200||!SERVER_TM)?0.5:1;
		objects.pref_arrow_left.alpha=(this.hours_to_photo_change>0||!SERVER_TM)?0.5:1;
		objects.pref_arrow_right.alpha=(this.hours_to_photo_change>0||!SERVER_TM)?0.5:1;
		objects.pref_reset_avatar_btn.alpha=(this.hours_to_photo_change>0||!SERVER_TM)?0.5:1;

	},

	check_time(last_time){


		//провряем можно ли менять
		const tm=Date.now();
		const days_since_nick_change=~~((tm-last_time)/86400000);
		const days_befor_change=30-days_since_nick_change;
		const ln=days_befor_change%10;
		const opt=[0,5,6,7,8,9].includes(ln)*0+[2,3,4].includes(ln)*1+(ln===1)*2;
		const day_str=['дней','дня','день'][opt];

		if (days_befor_change>0){
			this.send_info([`Поменять можно через ${days_befor_change} ${day_str}`,`Wait ${days_befor_change} days`][LANG])
			sound.play('locked');
			return 0;
		}

		return 1;
	},

	send_info(t){
		objects.pref_info.text=t
		anim3.add(objects.pref_info,{alpha:[0,1,'easeBridge']}, false, 3,false);
	},

	
	
	get_game_texture(){

		return this.bcg_loader?.resources['bcg'+my_data.bcg_id]?.texture||assets.bcg;

	},

	music_switch_down(){

		if(anim3.any_on()){
			sound.play('locked');
			return;
		}

		music.switch();
		sound.play('click3');
		const tar_x=music.on?119:80;//-39
		anim3.add(objects.music_slider,{x:[objects.music_slider.x,tar_x,'linear']}, true, 0.1);

	},

	sound_switch_down(){

		if(anim3.any_on()){
			sound.play('locked');
			return;
		}

		sound.switch();
		sound.play('click3');
		const tar_x=sound.on?280:241;//-39
		anim3.add(objects.sound_slider,{x:[objects.sound_slider.x,tar_x,'linear']}, true, 0.1);

	},

	ok_btn_down(){

		if(anim3.any_on()){
			sound.play('locked');
			return;
		}

		sound.play('close_it');

		if (this.avatar_changed){

			fbs.ref(`players/${my_data.uid}/pic_url`).set(this.cur_pic_url);

			my_data.avatar_tm=SERVER_TM
			fbs.ref(`players/${my_data.uid}/avatar_tm`).set(SERVER_TM);

			//обновляем аватар в кэше
			players_cache.update_avatar_forced(my_data.uid,this.cur_pic_url).then(()=>{
				const my_card=objects.mini_cards.find(card=>card.uid===my_data.uid);
				my_card.avatar.set_texture(players_cache.players[my_data.uid].texture);
			})

		}

		if (this.name_changed){

			my_data.name=this.name_changed;

			//обновляем мое имя в разных системах
			set_state({});

			my_data.nick_tm=SERVER_TM
			fbs.ref(`players/${my_data.uid}/nick_tm`).set(my_data.nick_tm);
			fbs.ref(`players/${my_data.uid}/name`).set(my_data.name);

		}


		this.switch_to_lobby();

		this.update_bcg();

	},

	async reset_avatar_down(){

		if (anim3.any_on()||this.tex_loading) {
			sound.play('blocked');
			return;
		}

		if (my_data.blocked){
			this.add_info('Функция недоступна, так как вы находитесь в черном списке');
			return;
		}

		//провряем можно ли менять фото
		if(this.hours_to_photo_change>0){
			this.send_info(`Фото можно поменять через ${this.hours_to_photo_change} ${this.getHoursEnding(this.hours_to_photo_change)}.`);
			sound.play('locked')
			return;
		}

		this.avatar_changed=1;
		this.cur_pic_url=my_data.orig_pic_url;
		this.tex_loading=1;
		const t=await players_cache.my_texture_from(my_data.orig_pic_url);
		objects.pref_avatar.set_texture(t);
		this.tex_loading=0;
		this.send_info(['Нажмите ОК чтобы сохранить','Press OK to confirm'][LANG])

	},

	async arrow_down(dir){

		if (my_data.blocked){
			this.add_info('Функция недоступна, так как вы находитесь в черном списке');
			return;
		}

		if (anim3.any_on()||this.tex_loading) {
			sound.play('blocked')
			return;
		}

		//провряем можно ли менять фото
		if(this.hours_to_photo_change>0){
			this.send_info(`Фото можно поменять через ${this.hours_to_photo_change} ${this.getHoursEnding(this.hours_to_photo_change)}.`);
			sound.play('locked')
			return;
		}

		//перелистываем аватары
		this.avatar_swtich_cur+=dir;
		if (this.avatar_swtich_cur===this.avatar_switch_center){
			this.cur_pic_url=players_cache.players[my_data.uid].pic_url
			this.avatar_changed=0
		}else{
			this.cur_pic_url='mavatar'+this.avatar_swtich_cur
			this.avatar_changed=1
		}

		this.tex_loading=1
		const t=await players_cache.my_texture_from(multiavatar(this.cur_pic_url))
		objects.pref_avatar.set_texture(t)
		this.tex_loading=0

	},

	

	async change_name_down(){

		if(anim3.any_on()){
			sound.play('locked');
			return;
		}

		if (my_data.blocked){
			this.add_info('Функция недоступна, так как вы находитесь в черном списке');
			return;
		}

		const rating_req=1450
		const games_req=50

		if (!(my_data.rating>=rating_req&&my_data.games>=games_req)){
			this.send_info([`НУЖНО: Рейтинг >${rating_req}, Игры >${games_req}`,`NEED: Rating >${rating_req}, Games >${games_req}`][LANG])
			sound.play('locked');
			return;
		}

		if (my_data.games<200){
			this.send_info('Нужно сыграть 200 онлайн партий чтобы поменять имя(((');
			sound.play('locked');
			return;
		}

		//провряем можно ли менять ник
		if(this.hours_to_nick_change>0){
			this.send_info(`Имя можно поменять через ${this.hours_to_nick_change} ${this.getHoursEnding(this.hours_to_nick_change)}.`);
			sound.play('locked');
			return;
		}

		//получаем новое имя
		const name=await keyboard.read(15)
		if (name&&name.replace(/\s/g, '').length>3){

			//обновляем данные о времени
			my_data.nick_tm=SERVER_TM
			fbs.ref(`players/${my_data.uid}/nick_tm`).set(my_data.nick_tm)

			my_data.name=name
			fbs.ref(`players/${my_data.uid}/name`).set(my_data.name)

			this.update_buttons()

			objects.pref_name.set2(name,260)
			this.send_info('Вы изменили имя)))')
			sound.play('confirm_dialog');

		}else{
			this.send_info('Неправильное имя(((');
			anim3.add(objects.pref_info,{alpha:[0,1,'easeBridge']}, false, 3,false);
		}

	},

	close(){

		//убираем контейнер
		anim3.add(objects.pref_cont,{x:[objects.pref_cont.x,-800,'linear']}, false, 0.4);
		anim3.add(objects.pref_footer_cont,{y:[objects.pref_footer_cont.y,450,'linear']}, false, 0.4);

	},

	close_btn_down(button_data){

		if(anim3.any_on()){
			sound.play('locked');
			return;
		}
		sound.play('click');
		this.switch_to_lobby();
	},

	switch_to_lobby(){

		this.close();

		//показываем лобби
		anim3.add(objects.cards_cont,{x:[800,0,'linear']}, true, 0.4);
		anim3.add(objects.lobby_header_cont,{y:[-200,objects.lobby_header_cont.sy,'linear']}, true, 0.4);
		anim3.add(objects.lobby_footer_cont,{y:[450,objects.lobby_footer_cont.sy,'linear']}, true, 0.4);

	},

}

dice={

	roll_timer:0,
	roll_timer2:0,
	click_timer:0,
	rnd1:0,
	rnd2:0,
	roll_res:'11',
	wait_click:0,
	roll_on:0,

	activate(){

		objects.dice_hand.visible=true

		this.click_timer=setInterval(()=>{

			if (objects.dice_hand.texture===assets.hand0)
				objects.dice_hand.texture=assets.hand1
			else
				objects.dice_hand.texture=assets.hand0

		},400)

	},

	roll_and_go(chip, roll_res){

		this.rnd1=irnd(1,6)
		this.rnd2=irnd(1,6)
		
		this.roll_on=1
		
		sound.play('dice')
		
		timer.pause()
		
		const player=objects.white_chip===chip?1:2

		if (roll_res){
			this.rnd1=+roll_res[0]
			this.rnd2=+roll_res[1]
		}else{

			//выбираем более интересные значения
			for (let i=0;i<5;i++){

				this.rnd1=irnd(1,6)
				this.rnd2=irnd(1,6)

				const next_cell_id=(chip.cell_id+this.rnd1+this.rnd2)%cells_data.length
				const next_cell=cells_data[next_cell_id]
				
				//не ходим на свои города
				if (next_cell.owner!==player)
					break

			}

		}


		this.roll_res=this.rnd1.toString()+this.rnd2.toString()

		//запускаем анимацию
		this.roll_timer=setInterval(()=>{
			this.rnd1=irnd(0,2)
			this.rnd2=irnd(0,2)
			objects.dice0.texture=assets['roll'+this.rnd1]
			objects.dice1.texture=assets['roll'+this.rnd2]
		},50)

		//выключаем через некоторое время
		this.roll_timer2=setTimeout(()=>{
			clearInterval(this.roll_timer)
			objects.dice0.texture=assets['d'+this.roll_res[0]]
			objects.dice1.texture=assets['d'+this.roll_res[1]]
			common.move_chip(chip,this.roll_res[0]*1+this.roll_res[1]*1)
			this.roll_timer=0
			this.roll_timer2=0
			this.roll_on=0
		},2000)

	},
	
	set_random(){
		
		objects.dice0.texture=assets['d'+irnd(1,6)]
		objects.dice1.texture=assets['d'+irnd(1,6)]
		
	},
	
	stop(){
		clearInterval(this.roll_timer)
		clearInterval(this.roll_timer2)
		this.roll_timer=0
		this.roll_timer2=0
		this.roll_on=0
	},

	pointerdown(){

		if (anim3.any_on()) {
			sound.play('decline')
			return
		}

		if (this.roll_timer) return
		if (!common.on) return

		//останавливаем
		//clearInterval(this.click_timer)
		//this.click_timer=0
		
		opponent.me_conf_play=1
		
		sound.play('click')

		//objects.dice_hand.visible=false
		this.roll_and_go(objects.white_chip);
		//отправляем сопернику
		fbs.ref('inbox/'+opp_data.uid).push({s:my_data.uid,type:'roll',roll_res:this.roll_res,tm:Date.now()})

		anim3.add(objects.roll_dice_btn,{scale_xy:[0.666,0.2,'easeInBack'],alpha:[1,0,'linear']}, false, 0.15);

	}


}

big_msg = {

	p_resolve : 0,

	show(params) {

		objects.big_msg_t1.text=params.t1||''
		objects.big_msg_t2.text=params.t2||''
		objects.big_msg_t3.text=params.t3||''

		objects.big_msg_fb_btn.visible = (!my_data.blocked)&&params.fb&&my_data.games>=200

		anim3.add(objects.big_msg_cont,{alpha:[0, 1,'linear'],scale_xy:[1,1.1,'ease2back']}, true, 0.2)

		//this.show_bonus_anim(objects.big_msg_energy,params.energy||0)

		return new Promise(function(resolve, reject){
			big_msg.p_resolve = resolve;
		});
	},

	show_bonus_anim(text_obj,tar_val){

		if (tar_val===0){
			text_obj.text=0
			return
		}

		const interval_time=(tar_val*52+948)/tar_val

		let lights=0
		const t=setInterval(()=>{
			lights++
			text_obj.text='+'+lights
			if (lights===tar_val)
				clearInterval(t)
		},interval_time)

	},

	async feedback_down() {

		if (anim3.any_on()){
			sound.play('locked');
			return;
		}

		sound.play('click');

		anim3.add(objects.big_msg_cont,{y:[objects.big_msg_cont.sy,450,'easeInBack']}, false, 0.4);

		//пишем отзыв и отправляем его
		const msg = await keyboard.read();
		if (msg) {
			let fb_id = irnd(0,50);
			await fbs.ref('fb/'+opp_data.uid+'/'+fb_id).set([msg, firebase.database.ServerValue.TIMESTAMP, my_data.name]);
		}

		this.p_resolve('close');

	},

	close() {

		if (anim3.any_on()){
			sound.play('locked');
			return;
		}

		sound.play('click');

		anim3.add(objects.big_msg_cont,{scale_xy:[1,0.5,'easeInBack'],alpha:[1,0,'linear']}, false, 0.5)
		this.p_resolve("close");
	}

}

city_dlg={

	cur_cell:0,

	check_buy(){

		//проверяем можно ли строить
		const price=this.cur_cell.level>0?this.cur_cell.house_cost:this.cur_cell.price
		const next_level=this.cur_cell.level+1
		const cur_country=this.cur_cell.country
		const cur_cities=cells_data.filter(d=>d.country===cur_country)
		const min_level=Math.min(...cur_cities.map(c=>c.level))
		const all_mine=cur_cities.every(c=> c.owner===1)

		if (next_level>2&& next_level<7&&common.houses_num===0){
			return 'no_houses'
		}

		if (my_data.money<price){
			return 'no_money'
		}

		if (!all_mine&&next_level>1){
			return 'not_all_mine'
		}

		if (next_level-min_level!==1){
			return 'not_all_complete'
		}

		return 'ok'

	},

	close_btn_down(){
		sound.play('click')
		this.close()
	},

	place_buttons(num,comm1,comm2){

		const btn1=objects.cell_info_btn1
		const btn2=objects.cell_info_btn2
		const btn1_t=objects.cell_info_btn1_t
		const btn2_t=objects.cell_info_btn2_t

		btn1.alpha=1
		btn2.alpha=1
		btn1_t.alpha=1
		btn2_t.alpha=1


		if (num===0){
			btn1.visible=false
			btn1_t.visible=false

			btn2.visible=false
			btn2_t.visible=false
		}

		if (num===1){

			if (comm1==='buy')
				btn2.pointerdown=function(){city_dlg.buy(1,this.cur_cell)}
			else
				btn2.pointerdown=function(){city_dlg.sell(1,this.cur_cell)}

			btn1.visible=false
			btn1_t.visible=false

			btn2.visible=true
			btn2_t.visible=true

			//btn2.x=100
			//btn2_t.x=185
		}

		if (num===2){

			btn1.pointerdown=function(){city_dlg.sell()}
			btn2.pointerdown=function(){city_dlg.buy()}

			btn1.visible=true
			btn1_t.visible=true

			btn2.visible=true
			btn2_t.visible=true

			//btn1.x=20
			//btn1_t.x=105

			//btn2.x=180
			//btn2_t.x=265
		}


	},

	update(cell){

		const id=cell.id
		this.cur_cell=cell

		objects.cell_info_title.text=cell.rus_name
		//objects.cell_info_params_header.text='Уровень'
		//objects.cell_info_prices_header.text='Рента'
		objects.cell_info_params.text='Только город\nГород и 1 дом\nГород и 2 дома\nГород и 3 дома\nГород и 4 дома\nГород и отель'
		objects.cell_info_prices.text='$ '+cell.rent[1]+'\n$ '+cell.rent[2]+'\n$ '+cell.rent[3]+'\n$ '+cell.rent[4]+'\n$ '+cell.rent[5]+'\n$ '+cell.rent[6]
		objects.cell_info_params.y=155
		objects.cell_info_prices.y=155

		const btn1=objects.cell_info_btn1
		const btn2=objects.cell_info_btn2
		const btn1_t=objects.cell_info_btn1_t
		const btn2_t=objects.cell_info_btn2_t

		//текущий уровень
		objects.cell_info_cur_level_hl.visible=cell.level?true:false
		objects.cell_info_cur_level_hl.y=123+cell.level*21

		if (cell.owner===2){
			this.place_buttons(1)
			btn2.alpha=0.5
			//btn2_t.alpha=0.5
			btn2_t.text='Куплено!'
			btn2.pointerdown=function(){}
			return
		}

		if (cell.owner===0){

			this.place_buttons(1,'buy')
			btn2_t.text=`КУПИТЬ ГОРОД\n-$${cell.price}`
			//sys_msg.add('Это свободный участок...')
			return
		}

		if (cell.owner===1){

			if (cell.level===1){
				this.place_buttons(2,'sell','buy')
				btn1_t.text=`ПРОДАТЬ ГОРОД\n+${Math.round(cell.price*0.5)}$`
				btn2_t.text=`КУПИТЬ ДОМ\n-${Math.round(cell.house_cost)}$`
			}

			if ([2,3,4].includes(cell.level)){
				this.place_buttons(2,'sell','buy')
				btn1_t.text=`ПРОДАТЬ ДОМ\n+${Math.round(cell.house_cost*0.5)}$`
				btn2_t.text=`КУПИТЬ ДОМ\n-${Math.round(cell.house_cost)}$`
			}

			if (cell.level===5){
				this.place_buttons(2,'sell','buy')
				btn1_t.text=`ПРОДАТЬ ДОМ\n+${Math.round(cell.house_cost*0.5)}$`
				btn2_t.text=`КУПИТЬ ОТЕЛЬ\n-${Math.round(cell.house_cost)}$`
			}

			if (cell.level===6){
				this.place_buttons(1,'sell')
				btn2_t.text=`ПРОДАТЬ ОТЕЛЬ\n+${Math.round(cell.house_cost*0.5)}$`
			}

		}


		//проверяем можно ли купить и строить
		if (btn2.visible&&this.check_buy()!=='ok'){
			btn2.alpha=0.5
			//btn2_t.alpha=0.5
		}

	},

	show(id){

		const cell=cells_data[id]
		//objects.cell_info_params.y=90
		//objects.cell_info_prices.y=90

		anim3.add(objects.cell_info_cont,{alpha:[0, 1,'linear'],scale_xy:[1,1.1,'ease2back']}, true, 0.2);
		this.update(cell)
		sound.play('city_dlg')


	},

	buy(){

		const check_buy_res=this.check_buy()

		if (check_buy_res==='not_all_mine'){
			sys_msg.add('Нужно купить все города!')
			return
		}

		if (check_buy_res==='not_all_complete'){
			sys_msg.add('Нужно строить последо вательно!')
			return
		}

		if (check_buy_res==='no_money'){
			sys_msg.add('Недостаточно средств для покупки!')
			sound.play('decline')
			return
		}

		if (check_buy_res==='no_houses'){
			sys_msg.add('В банке нет домов для покупки!')
			return
		}

		common.buy(1,this.cur_cell)

		//отправляем сопернику
		opponent.send({s:my_data.uid,type:'buy',cell_id:this.cur_cell.id,tm:Date.now()})

		this.update(this.cur_cell)
		this.close()
	},

	sell(){

		const country=cells_data.filter(d=>d.country===this.cur_cell.country)
		const max_level=Math.max(...country.map(c=>c.level))

		const new_level=this.cur_cell.level-1
		if (max_level-new_level>1){
			sys_msg.add('продавайте последовательно!')
			return
		}

		//если продаем отель - проверка что есть дома в банке
		if (this.cur_cell.level===6&&common.houses_num<4){
			sys_msg.add('В банке нет домов для размена!')
			return
		}


		common.sell(1,this.cur_cell)

		this.update(this.cur_cell)

		//отправляем сопернику
		opponent.send({s:my_data.uid,type:'sell',cell_id:this.cur_cell.id,tm:Date.now()})

		this.close()
	},

	close(){
		anim3.add(objects.cell_info_cont,{scale_xy:[1,0.5,'easeInBack'],alpha:[1,0,'linear']}, false, 0.5)
	},


}

fin={

	click_timer:0,

	activate(){

		if (this.click_timer) return

		objects.fin_hand.visible=true

		this.click_timer=setInterval(()=>{

			if (objects.fin_hand.texture===assets.hand0)
				objects.fin_hand.texture=assets.hand1
			else
				objects.fin_hand.texture=assets.hand0

		},400)

	},

	pointerdown(){

		if (anim3.any_on()) {
			sound.play('decline')
			return
		}
		
		if (!common.on) return

		if (my_data.money<=0){
			sound.play('decline')
			sys_msg.add('Восстановите положительный баланс!')
			return
		}


		sound.play('click')

		//отправляем сопернику
		opponent.send({s:my_data.uid,type:'fin',tm:Date.now()})

		//теперь уже не мой ход
		my_turn_started=0
		my_turn=0
		
		timer.start()

		objects.roll_dice_btn.visible=false
		
		anim3.add(objects.end_turn_btn,{scale_xy:[0.666,0.2,'easeInBack'],alpha:[1,0,'linear']}, false, 0.15);
	}

}

auc={

	cur_bid:0,
	new_bid:0,
	state:'on_my_bid',
	cur_cell:0,
	started:0,
	g_my_turn:0,

	activate(cell,state){

		this.state=state
		this.started=0

		anim3.add(objects.auc_cont,{alpha:[0, 1,'linear'],scale_xy:[1,1.1,'ease2back']}, true, 0.2)
		objects.auc_make_bid_btn.texture=assets.auc_make_bid_btn

		this.new_bid=this.cur_bid=cell.price
		this.cur_cell=cell
		objects.auc_bid.text=this.cur_bid+'$'
		objects.auc_asset_name.text=cell.rus_name
		
		//очередь до аукциона
		this.g_my_turn=my_turn
		
		sound.play('auc')

		if (this.state==='on_my_bid'){
			objects.auc_decline_btn.alpha=1
			objects.auc_make_bid_btn.alpha=1
			objects.auc_info.text='Делайте ставку...'
		}
		if (this.state==='on_opp_bid'){
			objects.auc_decline_btn.alpha=0.5
			objects.auc_make_bid_btn.alpha=0.5
			objects.auc_info.text='Ждем ставку соперника...'
		}

	},

	opp_bid(data){
		
		objects.auc_decline_btn.alpha=1
		objects.auc_make_bid_btn.alpha=1

		//соперник предложил ставку
		if (data.type==='auc_bid'){
			sound.play('auc_bid')
			objects.auc_decline_btn.alpha=1
			objects.auc_make_bid_btn.alpha=1
			this.started=1
			this.new_bid=this.cur_bid=data.bid
			objects.auc_bid.text=data.bid+'$'
			anim3.add(objects.auc_bid,{scale_xy:[1, 1.5,'ease2back']}, true, 0.25);
			objects.auc_info.text='Соперник сделал ставку! Ваш ход...'
			this.state='on_my_bid'
			
			//перезапускаем ход
			my_turn=1
			timer.start()
		}

		//мы отказались но соперник купил
		if(data.type==='auc_buy'){
			common.buy(2,this.cur_cell,this.new_bid)
			this.close()
			game_msgs.add('Соперник выиграл на аукционе город '+this.cur_cell.rus_name)
			
			//перезапускаем ход, аукцион завершен
			my_turn=this.g_my_turn
			timer.start()
		}

		//соперник сразу отказался от аукциона, не хочет покупать или нет денег
		if(data.type==='auc_dec'){
			sound.play('decline')
			objects.auc_decline_btn.alpha=1
			objects.auc_make_bid_btn.alpha=1
			objects.auc_make_bid_btn.texture=assets.auc_buy_btn_img
			objects.auc_info.text='Соперник не участвует, покупаете?'
			this.state='on_auc_dec'
			
			//перезапускаем ход
			my_turn=1
			timer.start()
		}

		//соперник тоже отказался покупать, аукцион завершен
		if(data.type==='auc_dec2'){
			sound.play('decline')
			this.close()
			game_msgs.add('Соперник тоже отказался покупать!')
			
			//перезапускаем ход, аукцион завершен
			my_turn=this.g_my_turn
			timer.start()
		}

		//соперник отказался от аукциона, но ставка уже сделана, сразу покупаем
		if(data.type==='auc_giveup'){
			common.buy(1,this.cur_cell,this.new_bid)
			this.close()
			game_msgs.add('Вы выиграли аукцион! Город Ваш!')
			
			//перезапускаем ход, аукцион завершен
			my_turn=this.g_my_turn
			timer.start()
		}
	
	},

	change_bid(d){

		if (anim3.any_on()) {
			return
		}

		sound.play('auc_change')

		if (this.state!=='on_my_bid'){
			anim3.add(objects.auc_info,{x:[objects.auc_info.x, objects.auc_info.x+10,'shake']}, true, 0.15);
			return
		}

		const _new_bid=this.new_bid+d*50

		if (_new_bid<this.cur_bid){
			objects.auc_info.text='Меньше поставить нельзя!'
			anim3.add(objects.auc_info,{x:[objects.auc_info.x, objects.auc_info.x+10,'shake']}, true, 0.15);
			return
		}

		if (_new_bid===this.cur_bid&&this.started){
			objects.auc_info.text='Меньше поставить нельзя!'
			anim3.add(objects.auc_info,{x:[objects.auc_info.x, objects.auc_info.x+10,'shake']}, true, 0.15);
			return
		}

		if (_new_bid>my_data.money){
			objects.auc_info.text='У Вас недостаточно денег!'
			anim3.add(objects.auc_info,{x:[objects.auc_info.x, objects.auc_info.x+10,'shake']}, true, 0.15);
			return
		}

		this.new_bid=_new_bid
		objects.auc_bid.text=this.new_bid+'$'

	},

	bcg_down(e){

		const mx=e.data.global.x/app.stage.scale.x
		const my=e.data.global.y/app.stage.scale.y


		if (mx>287&&mx<342&&my>194&&my<238){
			this.change_bid(-1)
		}

		if (mx>457&&mx<512&&my>194&&my<238){
			this.change_bid(+1)
		}
	},

	decline_btn_down(){

		if (anim3.any_on()) {
			return
		}

		if (this.state!=='on_my_bid'&&this.state!=='on_auc_dec'){
			anim3.add(objects.auc_info,{x:[objects.auc_info.x, objects.auc_info.x+10,'shake']}, true, 0.15);
			return
		}

		//отказываемся когда соперник сразу отказался от аукциона
		if(this.state==='on_auc_dec'){
			sound.play('decline')
			opponent.send({s:my_data.uid,type:'auc_dec2',tm:Date.now()})
			game_msgs.add('Вы тоже отказались от покупки!')
			this.close()
		}

		//отменяю сразу аукцион, соперник может купить или нет
		if (!this.started){
			sound.play('decline')
			opponent.send({s:my_data.uid,type:'auc_dec',tm:Date.now()})
			objects.auc_info.text='Вы отказались от аукциона. Ждем решения соперника...'
			this.state='on_my_dec'
			
			//перезапускаем ход
			my_turn=0
			timer.start()
		}

		//отказываюсь, пусть соперник берет по своей цене
		if (this.started){
			sound.play('decline')
			opponent.send({s:my_data.uid,type:'auc_giveup',tm:Date.now()})
			common.buy(2,this.cur_cell,this.cur_bid)
			game_msgs.add('Вы проиграли аукцион. Город купил соперник!')
			this.close()
			
			//перезапускаем ход, аукцион завершен
			my_turn=this.g_my_turn
			timer.start()
		}

		objects.auc_decline_btn.alpha=0.5
		objects.auc_make_bid_btn.alpha=0.5

	},
	
	close(){
		
		anim3.add(objects.auc_cont,{scale_xy:[1,0.5,'easeInBack'],alpha:[1,0,'linear']}, false, 0.5)
		
	},

	make_bid_down(){

		if (anim3.any_on()) {
			return
		}

		//нельзя так делать
		if (this.state==='on_opp_bid'){
			anim3.add(objects.auc_info,{x:[objects.auc_info.x, objects.auc_info.x+10,'shake']}, true, 0.15);
			return
		}

		//пытаемся делать ставку
		if (this.state==='on_my_bid'){

			if (this.new_bid<=this.cur_bid&&this.started){
				objects.auc_info.text='Выберите ставку больше!'
				sound.play('decline')
				return
			}

			if (this.cur_bid>my_data.money){
				objects.auc_info.text='У Вас недостаточно денег!'
				anim3.add(objects.auc_info,{x:[objects.auc_info.x, objects.auc_info.x+10,'shake']}, true, 0.15);
				return
			}

			sound.play('auc_bid')
			this.state='on_opp_bid'
			objects.auc_decline_btn.alpha=0.5
			objects.auc_make_bid_btn.alpha=0.5

			objects.auc_info.text='Вы сделали ставку. Ждем соперника...'
			opponent.send({s:my_data.uid,type:'auc_bid',bid:this.new_bid,tm:Date.now()})
			
			//перезапускаем ход
			my_turn=0
			timer.start()
		}

		//соперник сразу отказался, можно купить
		if (this.state==='on_auc_dec'){
			this.state=''
			game_msgs.add('Вы купили с аукциона') //это когда соперник отказался от аукциона
			objects.auc_cont.visible=false
			common.buy(1,this.cur_cell)

			//отправляем сопернику - покупка по обычной цене карточки
			opponent.send({s:my_data.uid,type:'auc_buy',cell_id:this.cur_cell.id,tm:Date.now()})
			
			//перезапускаем ход, аукцион завершен
			my_turn=this.g_my_turn
			timer.start()
		}
	}

}

casino={

	bid:0,
	roll_on:0,
	state:'',
	roll_sound_timer:0,

	activate(){

		sound.play('casino')
		this.state='ready'
		this.bid=Math.min(100,my_data.money)
		//objects.casino_bid.text=this.bid+' $'
		
		anim3.add(objects.casino_cont,{alpha:[0, 1,'linear'],scale_xy:[0.8,1,'easeOutBack']}, true, 0.2);
		objects.casino_cont.visible=true

		objects.casino_btn1.x=40
		objects.casino_btn1.alpha=1
		objects.casino_btn1.visible=true

		objects.casino_btn2.x=200
		objects.casino_btn2.alpha=1
		objects.casino_btn2.texture=assets.casino_btn2

		objects.casino_icon.tilePosition.y=0
		//objects.casino_icon2.tilePosition.y=60
		//objects.casino_icon3.tilePosition.y=120

		sys_msg.add('Нажмите КРУТИТЬ чтобы сыграть')

	},

	close(){

		sound.play('click')
		anim3.add(objects.casino_cont,{alpha:[1, 0,'linear'],scale_xy:[1,0.8,'easeInBack']}, false, 0.2);
		//objects.casino_cont.visible=false

	},

	roll_process(slot){
		slot.tilePosition.y+=10
	},

	stop(){


		clearInterval(this.roll_sound_timer)
		const result=irnd(0,5)
		objects.casino_icon.tilePosition.y=-90*result
		let city_id=0
		
		if (result===0){
			sound.play('lost300')
			game_msgs.add('Вы выиграли 300 $ в казино')
			common.change_money(1,300)
		}
		if (result===1){
			sound.play('casino_m_300')
			game_msgs.add('Вы проиграли 300 $ в казино')
			common.change_money(1,-300)
		}
		if (result===2){
			const empty_cities=common.get_empty_cities(1)
			if (empty_cities.length){
				const empty_city=empty_cities[irnd(0,empty_cities.length-1)]
				common.remove_empty_city(empty_city)
				city_id=empty_city.id
				sound.play('city_lost')
				game_msgs.add('Вы проиграли город '+empty_city?.rus_name)
			}else{
				game_msgs.add('Вам выпало потерять пустой город, но у вас их нет)))')	
			}

		}
		if (result===3){
			const empty_cities=common.get_empty_cities(2)
			if (empty_cities.length){
				const empty_city=empty_cities[irnd(0,empty_cities.length-1)]
				common.capture_empty_city(empty_city)
				city_id=empty_city.id
				game_msgs.add('Вы выиграли город соперника '+empty_city?.rus_name)
			}else{
				game_msgs.add('Вы выиграли захват пустого города, но у соперника их нет(((')	
			}
		}
		if (result===4){
			game_msgs.add('Вы можете купить любой город!')
			sound.play('can_buy_any_city')
			common.casino_buy_bonus=1
		}
		if (result===5){
			game_msgs.add('Вы не платите ренту 3 хода!')
			sound.play('can_buy_any_city')
			common.my_no_rent_bonus=3
		}
		opponent.send({s:my_data.uid,type:'casino_result',result,city_id,tm:Date.now()})

		this.state='fin'
		//objects.casino_btn1.visible=false
		//objects.casino_btn2.x=120
		//objects.casino_btn2.alpha=1
		//objects.casino_btn2.texture=assets.casino_exit_btn_img
		
		setTimeout(()=>{this.close()},1000)

	},

	btn1_down(){


		if (this.state==='roll'){
			return
		}

		if (this.state==='ready'){
			opponent.send({s:my_data.uid,type:'casino_decline',tm:Date.now()})
			game_msgs.add('Вы отказались от игры в казино')
			this.close()
			return
		}

		objects.casino_info.text='недоступно'

	},

	btn2_down(){

		if (this.state==='fin'){
			return
		}

		if (this.state==='roll'){
			return
		}

		opponent.send({s:my_data.uid,type:'casino_accept',tm:Date.now()})

		this.state='roll'
		
		this.roll_sound_timer=setInterval(()=>{
			if(!assets.casino_roll.isPlaying)
				sound.play('casino_roll')
		},100)
		
		objects.casino_icon.tilePosition.y=0

		some_process.casino_roll=function(){casino.roll_process(objects.casino_icon)}
		
		//затемняем кнопки
		objects.casino_btn1.alpha=0.5
		objects.casino_btn2.alpha=0.5

		setTimeout(()=>{this.stop();some_process.casino_roll=()=>{}},2500)

	}

}

exch={

	on:0,
	send_city_id:0,
	get_city_id:0,
	offer_balance:0,
	state:'offer',
	last_offer_tm:0,

	activate(data){
		
		this.on=1
		this.state='my_offer'

		objects.exch_btn1.alpha=1
		objects.exch_btn2.alpha=1

		objects.exch_btn1.texture=assets.exch_btn1
		objects.exch_btn2.texture=assets.exch_btn2

		anim3.add(objects.exch_cont,{alpha:[0, 1,'linear'],scale_xy:[1,1.1,'ease2back']}, true, 0.2)

		//если это предложение от соперника
		if (data){
			this.activate_offer(data)
			return
		}

		objects.exch_get_price.text='Выберите города для обмена'

		objects.exch_send_info.visible=true
		objects.exch_get_info.visible=true
		objects.exch_send_info.text='ВЫБЕРИТЕ ГОРОД КОТОРЫЙ ХОТИТЕ ОТДАТЬ'
		objects.exch_get_info.text='ВЫБЕРИТЕ ГОРОД КОТОРЫЙ ХОТИТЕ ПОЛУЧИТЬ'

		objects.exch_send_city.visible=false
		objects.exch_get_city.visible=false

		objects.exch_send_price.visible=false
		objects.exch_get_price.visible=false
	},

	activate_offer(data){

		this.state='opp_offer'


		objects.exch_get_price.text='Соперник предлагает обмен...'


		objects.exch_btn1.texture=assets.exch_decline_btn_img
		objects.exch_btn2.texture=assets.exch_approve_btn_img

		//получаем наоборот
		this.send_city_id=data.g
		this.get_city_id=data.sc

		const send_city=cells_data[data.g]
		const get_city=cells_data[data.sc]

		objects.exch_send_info.visible=false
		objects.exch_send_city.visible=true
		objects.exch_send_price.visible=true
		objects.exch_send_city.text=send_city.rus_name
		objects.exch_send_price.text=send_city.price+'$'

		objects.exch_get_info.visible=false
		objects.exch_get_city.visible=true
		objects.exch_get_price.visible=true
		objects.exch_get_city.text=get_city.rus_name
		objects.exch_get_price.text=get_city.price+'$'

		this.update_balance()

	},

	update_balance(){

		if (!this.send_city_id||!this.get_city_id) return

		objects.exch_balance.visible=true

		const send_city=cells_data[this.send_city_id]
		const get_city=cells_data[this.get_city_id]

		const balance=send_city.price-get_city.price
		this.offer_balance=balance

		//мне доплатить должны
		if (balance>0){
			objects.exch_balance.visible=true
			objects.exch_balance.text='+'+balance+'$'
			objects.exch_balance.x=objects.exch_get_price.x
		}

		//мне нужно доплатить
		if (balance<0){
			objects.exch_balance.visible=true
			objects.exch_balance.text='+'+Math.abs(balance)+'$'
			objects.exch_balance.x=objects.exch_send_price.x
		}

		//равноценная сделка
		if (balance===0){
			objects.exch_balance.visible=false
		}

	},

	cell_down(cell){

		if (this.state!=='my_offer')
			return


		if (cell.type!=='city'){
			objects.exch_info.text='нужно выбрать город'
			return
		}

		if (!cell.owner){
			objects.exch_info.text='нужно выбрать купленный город'
			return
		}

		if (cell.level>1){
			objects.exch_info.text='нужно выбрать город без зданий'
			return
		}

		if (cell.owner===1){
			this.send_city_id=cell.id
			objects.exch_send_info.visible=false
			objects.exch_send_city.visible=true
			objects.exch_send_price.visible=true
			objects.exch_send_city.text=cell.rus_name
			objects.exch_send_price.text=cell.price+'$'
		}else{
			this.get_city_id=cell.id
			objects.exch_get_info.visible=false
			objects.exch_get_city.visible=true
			objects.exch_get_price.visible=true
			objects.exch_get_city.text=cell.rus_name
			objects.exch_get_price.text=cell.price+'$'
		}

		this.update_balance()

	},

	btn1_down(){
		
		if (anim3.any_on()){
			sound.play('decline')
			return
		}
		

		if (this.state==='opp_offer'){
			fbs.ref('inbox/'+opp_data.uid).push({s:my_data.uid,type:'exch_decline',tm:Date.now()})
			game_msgs.add('Вы отклонили сделку!')
			
			//перезапускаем
			my_turn=0
			timer.start()
		}

		this.close()
	},

	btn2_down(){
		
		if (anim3.any_on()){
			sound.play('decline')
			return
		}
		
		if (this.state==='opp_offer'){

			common.change_money(1,this.offer_balance)
			common.change_money(2,-this.offer_balance)
			cells_data[this.send_city_id].owner=2
			cells_data[this.get_city_id].owner=1
			common.update_view(cells_data[this.send_city_id])
			common.update_view(cells_data[this.get_city_id])

			//отправляем сопернику
			fbs.ref('inbox/'+opp_data.uid).push({s:my_data.uid,type:'exch_approve',tm:Date.now()})

			game_msgs.add('Вы одобрили сделку сделку!')
			this.close()
		}

		if (this.state==='my_offer'){

			if (!objects.exch_send_city.visible||!objects.exch_get_city.visible){
				objects.exch_get_price.text='Выберите города для обмена'
				return
			}
			
			this.state='wait'

			objects.exch_info.text='Ждем решения соперника...'

			//отправляем предложение сопернику
			fbs.ref('inbox/'+opp_data.uid).push({s:my_data.uid,type:'exch',sc:this.send_city_id,g:this.get_city_id,tm:Date.now()})
			
			this.last_offer_tm=Date.now()
			
			objects.exch_btn1.alpha=0.5
			objects.exch_btn2.alpha=0.5
			
			//перезапускаем
			my_turn=0
			timer.start()

		}

	},

	opp_decline(){

		this.close()
		game_msgs.add('Соперник отклонил сделку!')
		
		//перезапускаем
		my_turn=1
		timer.start()
	},

	opp_approve(){

		common.change_money(1,this.offer_balance)
		common.change_money(2,-this.offer_balance)

		cells_data[this.send_city_id].owner=2
		cells_data[this.get_city_id].owner=1

		common.update_view(cells_data[this.send_city_id])
		common.update_view(cells_data[this.get_city_id])

		this.close()
		game_msgs.add('Соперник одобрил сделку!')
		
		//перезапускаем
		my_turn=1
		timer.start()
		
	},

	close(){

		this.on=0
		anim3.add(objects.exch_cont,{alpha:[1, 0,'linear'],scale_xy:[1,0.8,'easeInBack']}, false, 0.2);
	}


}

plans={

	plans_progress:[0,0,0],
	action_made:0,

	activate(){

		this.action_made=0
		anim3.add(objects.plans_cont,{alpha:[0, 1,'linear'],scale_xy:[1,1.1,'ease2back']}, true, 0.2)
		objects.plans_get100_btn.alpha=1
		this.update()
		sound.play('plans_popup')

	},

	close_btn_down(){

		//sound.play('click')
		anim3.add(objects.plans_cont,{scale_xy:[1,0.5,'easeInBack'],alpha:[1,0,'linear']}, false, 0.5);

	},
	
	update(){

		for (let i=0;i<3;i++){
			objects.plans_mask[i].width=this.plans_progress[i]

			if (this.plans_progress[i]===100)
				objects.plans_btn_title[i].text='Применить'
			else
				objects.plans_btn_title[i].text='Доработать'

			objects.plans_ready_info[i].text=this.plans_progress[i]+'%'
		}

	},

	bcg_down(e){

		const mx = e.data.global.x/app.stage.scale.x
		const my = e.data.global.y/app.stage.scale.y

		if (my>250||my<200) return

		let i=0
		if (mx>220&&mx<340) i=0
		if (mx>340&&mx<460) i=1
		if (mx>460&&mx<580) i=2

		if (this.action_made){
			sys_msg.add('Вы уже сделали выбор')
			return
		}

		setTimeout(()=>{this.close_btn_down()},300)
		
		//активация бонуса
		if (this.plans_progress[i]===100){

			if (i===0){
				//захват одинокого города
				const empty_cities=common.get_empty_cities(2)
				if(empty_cities.length){
					
					const city_cell=empty_cities[irnd(0,empty_cities.length-1)]
					game_msgs.add('Вы достигли цели ВОЙНА и захватили город '+city_cell.rus_name)
					common.capture_empty_city(city_cell)
					opponent.send({s:my_data.uid,type:'plan',id:i,city_id:city_cell.id,tm:Date.now()})
				}else{
					sys_msg.add('Данный план невозможно сейчас реализовать')
					return
				}
			}

			if (i===1){
				common.set_money(2,-300)
				game_msgs.add('Вы достигли цели КРАЖА баланс соперника -300$ )))')
				opponent.send({s:my_data.uid,type:'plan',id:i,tm:Date.now()})
			}

			if (i===2){
				common.change_money(1,2000)
				game_msgs.add('Вы достигли цели НАСЛЕДСТВО (+2000 $)')
				opponent.send({s:my_data.uid,type:'plan',id:i,tm:Date.now()})
			}


			sound.play('achivement')
			this.plans_progress[i]=0
			this.update()
			this.action_made=1
			return
		}

		sound.play('plans_click')
		this.action_made=1

		this.plans_progress[i]+=25
		this.plans_progress[i]=Math.min(this.plans_progress[i],100)
		
		game_msgs.add('Вы доработали план '+['ВОЙНА','КРАЖА','НАСЛЕДСТВО'][i])

		objects.plans_mask[i].width=this.plans_progress[i]
		objects.plans_ready_info[i].text=this.plans_progress[i]+'%'
		
		opponent.send({s:my_data.uid,type:'plan',id:-1,tm:Date.now()})

		this.update()
		
		

	},

	get100_btn_down(){

		if (this.action_made){
			sys_msg.add('Вы уже сделали выбор')
			return
		}
		
		this.action_made=1
		objects.plans_get100_btn.alpha=0.5
		common.change_money(1,100)
		game_msgs.add('Вы получили 100 $')
		opponent.send({s:my_data.uid,type:'plan',id:100,tm:Date.now()})
		setTimeout(()=>{this.close_btn_down()},300)
	}

}

online_game={

	on:0,
	start_time:0,
	move_time_start:0,
	disconnect_time:0,
	opp_conf_play:0,
	me_conf_play:0,
	write_fb_timer:0,

	activate(seed, turn){

		this.on=1;

		my_turn=turn;
		
		//запоминаем оппонента
		opponent=this
		
		//запускаем таймер
		timer.start()
		objects.timer_cont.visible=true

		//если открыты другие окна то закрываем их
		if (objects.chat_cont.visible) chat.close()
		if (bot_game.on) bot_game.clear()

		//устанавливаем локальный и удаленный статус
		set_state({state:'p'})

		sound.play('start2')

		//показываем кнопки
		objects.game_buttons.visible=true
		
		//общие параметры
		common.activate()
		
		if (my_turn)
			game_msgs.add('Началась онлайн игра, ваш ход...')
		else
			game_msgs.add('Началась онлайн игра, начинает соперник...')
		


	},

	send(data){

		//отправляем ход онайлн сопернику (с таймаутом)
		clearTimeout(this.write_fb_timer);
		this.write_fb_timer=setTimeout(function(){game.stop('my_no_connection');}, 8000);
		fbs.ref('inbox/'+opp_data.uid).push(data).then(()=>{
			clearTimeout(this.write_fb_timer);
		});

	},

	async exit_btn_down(){

		/*if (Date.now()-this.start_time<10000){
			message.add(['Нельзя сдаваться в начале игры','can nott give up at the beginning of the game'][LANG])
			return;
		}*/

		let res = await confirm_dialog.show(['Сдаетесь?','Giveup?'][LANG]);
		if (res==='ok'&&this.on){
			fbs.ref('inbox/'+opp_data.uid).push({m:'END',s:my_data.uid,tm:Date.now()});
			common.stop('my_giveup');
		}

	},

	async send_message(){

		if (anim3.any_on()||objects.stickers_cont.visible) {
			sound.play('locked');
			return
		};

		const msg=await keyboard.read();

		//если есть данные то отправляем из сопернику
		if (msg){
			fbs.ref('inbox/'+opp_data.uid).push({s:my_data.uid,m:'CHAT',tm:Date.now(),data:msg});
			message.add({text:msg, timeout:3000,sound_name:'online_message',sender:'me'});
		}
	},

	game_btn_down(e){

		if (anim3.any_on()||!this.on){
			sound.play('locked');
			return
		}

		const mx = e.data.global.x/app.stage.scale.x - objects.game_buttons.sx;
		const my = e.data.global.y/app.stage.scale.y - objects.game_buttons.sy;

		const btns_pos = [this.stickers_btn_pos, this.chat_btn_pos, this.giveup_btn_pos, this.exch_btn_pos];

		let min_dist=999;
		let min_button=-1;

		for (let b = 0 ; b < 4 ; b++) {

			const anchor_pos = btns_pos[b];
			const dx = mx-anchor_pos[0];
			const dy = my-anchor_pos[1];
			const d = Math.sqrt(dx * dx + dy * dy);

			if (d < 40 && d < min_dist) {
				min_dist = d;
				min_btn_id = b;
			}
		}

		//подсветка кнопки
		if (min_btn_id !== -1) {
			sound.play('click');
			objects.hl_main_btn.x=btns_pos[min_btn_id][0]+objects.game_buttons.sx;
			objects.hl_main_btn.y=btns_pos[min_btn_id][1]+objects.game_buttons.sy;
			anim3.add(objects.hl_main_btn,{alpha:[1,0,'linear']}, false, 0.6,false);
		}


		if (min_btn_id === 0)
			stickers.show_panel()
		if (min_btn_id === 1)
			this.send_message()
		if (min_btn_id === 2)
			this.exit_btn_down()
		if (min_btn_id === 3)
			common.exch_down()

	},

	calc_new_rating(old_rating, game_result) {

		if (game_result === NOSYNC)
			return old_rating;

		var Ea = 1 / (1 + Math.pow(10, ((opp_data.rating-my_data.rating)/400)));
		if (game_result === WIN)
			return Math.round(my_data.rating + 16 * (1 - Ea));
		if (game_result === DRAW)
			return Math.round(my_data.rating + 16 * (0.5 - Ea));
		if (game_result === LOSE)
			return Math.round(my_data.rating + 16 * (0 - Ea));

	},

	chat(data) {

		message.add({text:data, timeout:10000,sound_name:'online_message',sender:'opp'});

	},

	process_move(){
		
		
	},

	async stop(res){
		
		this.on=0;

		const res_array = [
			['my_win',WIN , ['Соперник банкрот!','You win!']],
			['my_timeout',LOSE , ['Вы проиграли! У вас закончилось время','You lose! You out of time']],
			['my_no_sync',NOSYNC , ['Похоже вы не захотели начинать игру.','It looks like you did not want to start the game']],
			['opp_no_sync',NOSYNC , ['Похоже соперник не смог начать игру.','It looks like the opponent could not start the game']],
			['opp_timeout',WIN , ['У соперника закончилось время','You win! Opponent out of time']],
			['my_giveup',LOSE , ['Вы банкрот!','You lose!']],
			['opp_giveup',WIN , ['Соперник банкрот!','You win!']],
			['timer_error',LOSE , ['Ошибка таймера!','Timer error!']],
			['opp_win',WIN , ['Вы банкрот!','You lose!']],
			['draw',DRAW , ['Ничья!','You lose!']],
			['my_stop',DRAW , ['Вы отменили игру.','You canceled the game']]
		];

		let result_number = res_array.find( p => p[0] === res)[1];
		let result_info = res_array.find( p => p[0] === res)[2][LANG];

		//выключаем элементы
		objects.stop_bot_btn.visible=false
		objects.timer_cont.visible=false
				

		//воспроизводим звук
		if (result_number === DRAW || result_number === LOSE)
			sound.play('lose');
		else
			sound.play('win');
		
		//scheduler.stop_all()
		dice.stop()	
		
		const old_rating = my_data.rating
		my_data.rating = this.calc_new_rating(my_data.rating, result_number)

		await big_msg.show({t1:['Игра завершена','Game over'][LANG],t2:result_info, t3:`${old_rating} > ${my_data.rating}`, fb:true})
		
		objects.auc_cont.visible=false
		objects.cell_info_cont.visible=false
		objects.plans_cont.visible=false
		objects.casino_cont.visible=false
		objects.exch_cont.visible=false
		objects.game_buttons.visible=false
		sys_msg.close()
	},
	
	close(){

		//убираем процессинг эйминга соперника
		some_process.opp_aiming=function(){}

		this.on=0;
		anim3.add(objects.board_stuff_cont,{y:[0,450,'linear']}, false, 0.5);
		objects.hit_level_cont.visible=false;
		objects.fine_tune_cont.visible=false;
		objects.swords.visible=false;
		objects.my_card_cont.visible=false;
		objects.opp_card_cont.visible=false;
		objects.game_buttons.visible=false;
		set_state({state:'o'});

	}

}

bot_game={

	plans_progress:[0,0,0],
	on:0,
	opp_conf_play:0,
	me_conf_play:0,
	
	activate(){

		//показываем и заполняем мою карточку
		opp_data.uid='bot'
		opponent=this
		my_turn=1
		this.on=1
		
		opponent=this
		
		objects.stop_bot_btn.visible=true
		
		this.plans_progress=[0,0,0]
		
		
		objects.timer_text.text='!!!'
		
		for (let i=0;i<24;i++){

			const cell_obj=objects.cells[i]
			const cell=cells_data[i]

			if ([0,7,12,19].includes(i)){
				cell_obj.bcg.texture=assets.big_cell_bcg
				cell_obj.bcg.width=83
				cell_obj.bcg.height=83
			}else{
				cell_obj.bcg.texture=assets.cell_bcg
				cell_obj.bcg.width=74
				cell_obj.bcg.height=74
			}

			if (cell.type==='city'){
				cell_obj.price.text=cell.price+'$'
				cell_obj.interactive=true
				cell_obj.buttonMode=true
				cell_obj.pointerdown=function(){common.cell_down(i)}
				cell_obj.auc_icon.visible=cell.auc?true:false
				cell_obj.city_name.text=cell.rus_name
			}

			if (cell.type==='casino'){
				cell_obj.bcg.texture=assets.big_cell_casino_bcg
				cell_obj.price.visible=false
				cell_obj.city_name.visible=false
				cell_obj.interactive=false
				cell_obj.buttonMode=false
				cell_obj.auc_icon.visible=false
				cell_obj.icon.visible=false

			}

			if (cell.type==='start'){
				cell_obj.bcg.texture=assets.big_cell_start_bcg
				cell_obj.price.visible=false
				cell_obj.city_name.visible=false
				cell_obj.interactive=false
				cell_obj.buttonMode=false
				cell_obj.auc_icon.visible=false
				cell_obj.icon.visible=false

			}

			if (cell.type==='?'){
				cell_obj.price.visible=false
				cell_obj.city_name.visible=false
				cell_obj.interactive=false
				cell_obj.buttonMode=false
				cell_obj.auc_icon.visible=false
				cell_obj.icon.visible=true
			}

		}

		common.activate()
		
		game_msgs.add('Игра против бота началась, ваш ход...')

	},

	send(data){

		//console.log(data)
		if (data.type==='auc_dec'){
			if (my_turn){

				scheduler.add(()=>{
					if(opp_data.money>auc.new_bid)
						auc.opp_bid({type:'auc_buy'})
					else
						auc.opp_bid({type:'auc_dec2'})
				},1000)
			}else{
				common.opp_fin_move_event()
			}
		}

		//соперник купил если бот отказался сразу
		if (data.type==='auc_buy'){
			if (!my_turn)
				common.opp_fin_move_event()
		}

		//торговля
		if (data.type==='auc_bid'){

			const new_bid=auc.new_bid+50
			const left_after_buy=opp_data.money-new_bid
			const country=cells_data.filter(d=>d.country===auc.cur_cell.country)
			const country_size=country.length
			const my_in_country=country.filter(c=>{return c.owner===2}).length
			
			const risk_map={'30':300,'31':150,'32':50,'20':150,'21':50}
			const min_left=risk_map[country_size+''+my_in_country]

			if(left_after_buy<min_left){
				scheduler.add(()=>{
					auc.opp_bid({type:'auc_giveup'})
					if (!my_turn)
						common.opp_fin_move_event()
				},1000)

			}
			else{
				
				scheduler.add(()=>{auc.opp_bid({type:'auc_bid',bid:new_bid})},1000)					

			}

		}

		//игрок отказался и бот купил
		if (data.type==='auc_giveup'){
			if (!my_turn)
				common.opp_fin_move_event()
		}

		//игрок завершил ход, ходит бот
		if (data.type==='fin'){
			dice.roll_and_go(objects.yellow_chip)
		}

	},

	clear(){
		
		objects.stop_bot_btn.visible=false
		objects.auc_cont.visible=false
		objects.cell_info_cont.visible=false
		objects.plans_cont.visible=false
		objects.casino_cont.visible=false
		objects.exch_cont.visible=false
		scheduler.stop_all()
		sys_msg.close()
		
	},

	try_upgrade_some_city(){

		for (const cell of cells_data){

			if (cell.type==='city'&&cell.owner===2){

				const cur_country=cell.country
				const cur_cities=cells_data.filter(d=>d.country===cur_country)
				const min_level=Math.min(...cur_cities.map(c=>c.level))
				const all_mine=cur_cities.every(c=>c.owner===2)
				const next_level=cell.level+1
				const price=cell.level>0?cell.house_cost:cell.price
				const houses_available=next_level===6?1:common.houses_num
				const can_upgrade=all_mine&&(next_level-min_level===1)&&opp_data.money>=price&&next_level<7&&houses_available
				if (can_upgrade){
					common.buy(2,cell)
					return

				}

			}

		}

	},

	try_sell_some(){

		//если баланс восстановлен
		if (opp_data.money>0) {
			scheduler.add(()=>{common.opp_fin_move_event()},500)
			return;
		}

		//продаем первое попавшееся
		let cell_to_sell=null
		for (const cell of cells_data){
			if (cell.type==='city'&&cell.owner===2){

				const cur_country=cell.country
				const cur_cities=cells_data.filter(d=>d.country===cur_country)
				const max_level=Math.max(...cur_cities.map(c=>c.level))
				const all_mine=cur_cities.every(c=>c.owner===2)
				const next_level=cell.level-1

				const can_sell=(all_mine&&max_level-next_level===1)||(!all_mine&&next_level===0)
				if (can_sell){
					cell_to_sell=cell
					break
				}
			}
		}

		if (cell_to_sell){
			scheduler.add(()=>{common.sell(2,cell_to_sell)},1000)
			scheduler.add(()=>{this.try_sell_some()},2000)
		}else{
			common.stop('my_win')
		}

	},
	
	stop_btn_down(){
		
		if (anim3.any_on()) {
			sound.play('decline')
			return
		}
		
		common.stop('my_stop')
		
	},
	
	async stop(res){
	
		this.on=0

		const res_array = [
			['my_win',WIN , ['Вы выиграли!','You win!']],
			['opp_win',WIN , ['Вы проиграли!','You lose!']],
			['my_stop',DRAW , ['Вы отменили игру.','You canceled the game']]
		];

		const result_number = res_array.find( p => p[0] === res)[1];
		const result_info = res_array.find( p => p[0] === res)[2][LANG];

		//выключаем элементы
		objects.stop_bot_btn.visible=false		

		//воспроизводим звук
		if (result_number === DRAW || result_number === LOSE)
			sound.play('lose');
		else
			sound.play('win');
		
		scheduler.stop_all()
		dice.stop()	

		await big_msg.show({t1:['Игра завершена','Game over'][LANG],t2:result_info,t3:'*** *** ***',fb:1})
		
		this.clear()
		
	},

	process_move(cell){

		//свободная клетка
		if (cell.type==='city'&&cell.owner===0){

			if (cell.auc){
				//делаем начальную ставку
				if (opp_data.money>cell.price){
					scheduler.add(()=>{auc.activate(cell,'on_opp_bid')},1000)
					scheduler.add(()=>{auc.opp_bid({type:'auc_bid',bid:auc.cur_bid})},2000)
				}else{
					scheduler.add(()=>{auc.activate(cell,'on_opp_bid')},1000)
					scheduler.add(()=>{auc.opp_bid({type:'auc_dec'})},2000)
				}


			}else{
				//пытаемся купить город
				if (cell.type==='city'){
					if (opp_data.money>cell.price){
						scheduler.add(()=>{common.buy(2,cell)},1000)
						scheduler.add(()=>{this.try_upgrade_some_city()},1500)
						scheduler.add(()=>{common.opp_fin_move_event()},2000)
					}else{
						scheduler.add(()=>{this.try_upgrade_some_city()},1000)
						scheduler.add(()=>{common.opp_fin_move_event()},1500)
					}
				}
			}
		}

		//город бота, просто завершаем
		if (cell.owner===2){
			scheduler.add(()=>{this.try_upgrade_some_city()},1000)
			scheduler.add(()=>{common.opp_fin_move_event()},2000)
		}

		//город игрока, просто завершаем (рента оплачена)
		if (cell.owner===1){

			if (opp_data.money<=0){
				this.try_sell_some()
			}else{
				scheduler.add(()=>{this.try_upgrade_some_city()},1000)
				scheduler.add(()=>{common.opp_fin_move_event()},2000)
			}


		}

		//стартовая фигура, просто завершаем
		if (cell.id===0){
			scheduler.add(()=>{this.try_upgrade_some_city()},1000)
			scheduler.add(()=>{common.opp_fin_move_event()},2000)
		}

		//казино
		if (cell.type==='casino'){
			
			this.play_casino()
			scheduler.add(()=>{this.try_upgrade_some_city()},1000)
			scheduler.add(()=>{common.opp_fin_move_event()},2000)
		}

		//цели
		if (cell.type==='?'){

			if (this.plans_progress[0]>=100){
				const empty_cities=common.get_empty_cities(1)
				
				if(empty_cities.length) {
					const empty_city=empty_cities[irnd(0,empty_cities.length-1)]
					common.capture_empty_city(empty_city)
					this.plans_progress[0]=0
					sound.play('achivement')
					game_msgs.add('Соперник реализовал план Захват ('+empty_city.rus_name+')')
				}else{
					
					game_msgs.add('Соперник не смог реализовать план Захват!')
				}
			}else{
				this.plans_progress[0]+=25
			}

			scheduler.add(()=>{this.try_upgrade_some_city()},1000)
			scheduler.add(()=>{common.opp_fin_move_event()},2000)
		}

	},
	
	play_casino(){
		
		common.process_opp_move({type:'casino_accept'})
		
		const result=irnd(0,5)
		let city_id=0
		
		if (result===0){
			game_msgs.add('Соперник выиграл 300 $ в казино')
			common.change_money(2,300)
		}
		if (result===1){
			sound.play('lost300')
			game_msgs.add('Соперник проиграл 300 $ в казино')
			common.change_money(2,-300)
		}
		if (result===2){
			const empty_cities=common.get_empty_cities(2)
			if (empty_cities.length){
				const empty_city=empty_cities[irnd(0,empty_cities.length-1)]
				common.remove_empty_city(empty_city)
				city_id=empty_city.id
				sound.play('city_lost')
				game_msgs.add('Соперник в казино город '+empty_city?.rus_name)
			}else{
				game_msgs.add('Соперник чуть не потерял город в казино')	
			}

		}
		if (result===3){
			const empty_cities=common.get_empty_cities(1)
			if (empty_cities.length){
				const empty_city=empty_cities[irnd(0,empty_cities.length-1)]
				common.capture_empty_city(empty_city)
				city_id=empty_city.id
				game_msgs.add('Соперник захватил Ваш город '+empty_city.rus_name)
			}else{
				game_msgs.add('У вас нет одиноких городов, повезло')	
			}
		}
		if (result===4){
			
			const free_cities=cells_data.filter(c=>c.owner===0)
			for (let city of free_cities){
				if (city.price<opp_data.money){
					
					common.buy(2,city)
					game_msgs.add('Соперник купил город по акции: '+city.rus_name)
					return				
				}				
			}
			
			game_msgs.add('Соперник не смог купить город по акции!')
		}
		if (result===5){
			common.opp_no_rent_bonus=3
			game_msgs.add('Соперник не платит ренту 3 хода!')
		}
		
	}

}

common={

	on:0,
	houses_num:30,
	casino_buy_bonus:0,
	chip_sound_timer:0,
	my_no_rent_bonus:0,
	opp_no_rent_bonus:0,
	move_on:0,

	activate(){

		if (my_turn){
			objects.roll_dice_btn.visible=true
			objects.roll_dice_btn.scale_xy=0.666
			objects.end_turn_btn.visible=false
		}else{
			objects.roll_dice_btn.visible=false
			objects.end_turn_btn.visible=false
		}

		this.place_chip(objects.white_chip,0)
		this.place_chip(objects.yellow_chip,0)

		objects.cells_cont.visible=true

		objects.bcg.texture=assets.lobby_bcg
		
		//бонусы не платить ренту
		this.my_no_rent_bonus=0
		this.opp_no_rent_bonus=0
		
		opponent.opp_conf_play=0
		opponent.me_conf_play=0

		//количество домов
		this.houses_num=30
		objects.houses_info.text='Домов в банке: '+this.houses_num
		
		anim3.add(objects.board_bcg,{alpha:[0,1,'linear']}, true, 0.3);

		//показываем и заполняем мою карточку
		anim3.add(objects.my_card_cont,{x:[-200,objects.my_card_cont.sx,'linear'],alpha:[0,1,'linear']}, true, 0.3)
		objects.my_card_rating.text=my_data.rating;
		objects.my_card_name.set2(my_data.name,160)
		
		this.on=1
		
		dice.set_random()
		game_msgs.activate()
		
		//начальный баланс
		this.set_money(1,1000)
		this.set_money(2,1000)
		
		sound.play('game_start')
		
		objects.my_avatar.texture=players_cache.players[my_data.uid].texture

		//показываем и заполняем карточку соперника
		anim3.add(objects.opp_card_cont,{x:[800,objects.opp_card_cont.sx,'linear'],alpha:[0,1,'linear']}, true, 0.3)
		objects.opp_card_name.set2(opp_data.name,160);
		objects.opp_card_rating.text=opp_data.rating;
		objects.opp_avatar.texture=players_cache.players[opp_data.uid].texture;

		for (let i=0;i<24;i++){

			const cell_obj=objects.cells[i]
			const cell=cells_data[i]

			if ([0,7,12,19].includes(i)){
				cell_obj.bcg.texture=assets.big_cell_bcg
				cell_obj.bcg.width=83
				cell_obj.bcg.height=83
			}else{
				cell_obj.bcg.texture=assets.cell_bcg
				cell_obj.bcg.width=74
				cell_obj.bcg.height=74
				cell_obj.city_name.tint=0xffffff
			}

			if (cell.type==='city'){
				cell_obj.price.text=cell.price+'$'
				cell_obj.interactive=true
				cell_obj.buttonMode=true
				cell_obj.pointerdown=function(){common.cell_down(i)}
				cell_obj.auc_icon.visible=cell.auc?true:false
				cell_obj.city_name.text=cell.rus_name
				cell.owner=0
				cell.level=0
				cell_obj.level_icon.texture=null
				cell_obj.price.visible=true
				cell_obj.auc_icon.visible=cell.auc?true:false
			}

			if (cell.type==='casino'){
				cell_obj.bcg.texture=assets.big_cell_casino_bcg
				cell_obj.price.visible=false
				cell_obj.city_name.visible=false
				cell_obj.interactive=false
				cell_obj.buttonMode=false
				cell_obj.auc_icon.visible=false
				cell_obj.icon.visible=false
			}

			if (cell.type==='start'){
				cell_obj.bcg.texture=assets.big_cell_start_bcg
				cell_obj.price.visible=false
				cell_obj.city_name.visible=false
				cell_obj.interactive=false
				cell_obj.buttonMode=false
				cell_obj.auc_icon.visible=false
				cell_obj.icon.visible=false

			}

			if (cell.type==='?'){
				cell_obj.price.visible=false
				cell_obj.city_name.visible=false
				cell_obj.interactive=false
				cell_obj.buttonMode=false
				cell_obj.auc_icon.visible=false
				cell_obj.icon.visible=true
			}

		}

	},

	cell_down(id){
		
		if(!this.on) return

		if(!my_turn){
			sys_msg.add('Не ваша очередь!')
			return
		}

		if(!my_turn_started){
			sys_msg.add('Сначала нужно бросить кубики...')
			return
		}

		const cell=cells_data[id]

		//если открыта торговля то переносим в торговлю не улучшеные города
		if (exch.on){
			exch.cell_down(cell)
			return
		}
		
		
		if(cell.owner===0&&id!==objects.white_chip.cell_id&&!this.casino_buy_bonus){
				sys_msg.add('Этот город еще не куплен...')
				return
		}


		//if (cell.owner!==0){
		//	sys_msg.add('Этот город уже куплен!')
		//	return
		//}

		if (cell.type==='city')
			city_dlg.show(id)
	},

	exch_down(){

		if(!this.on) return
		
		if(!my_turn){
			sys_msg.add('Не ваша очередь!')
			return
		}

		if(!my_turn_started){
			sys_msg.add('Сначала нужно бросить кубики...')
			return
		}


		const tm=Date.now()
		if (tm-exch.last_offer_tm<60000){
			sys_msg.add('Нужно подождать...')
			return
		}

		exch.activate()

	},

	update_view(cell){

		const cell_spr=objects.cells[cell.id]

		if (cell.owner===1)	{
			cell_spr.bcg.texture=assets.cell_bcg_white
			cell_spr.city_name.tint=0xffffff
			cell_spr.level_icon.tint=0x999999
		}
		if (cell.owner===2){
			cell_spr.bcg.texture=assets.cell_bcg_yellow
			cell_spr.city_name.tint=0xffffff
			cell_spr.level_icon.tint=0xC00000
		}
		if (cell.owner===0){
			cell_spr.bcg.texture=assets.cell_bcg
			cell_spr.city_name.tint=0xffffff
		}	

		if (cell.type==='city'){


			const level_to_s_icon={
				0:null,
				1:null,
				2:assets.house1_icon,
				3:assets.house2_icon,
				4:assets.house3_icon,
				5:assets.house4_icon,
				6:assets.hotel_icon,
			}

			//иконка аукциона
			cell_spr.auc_icon.visible=(cell.level===0&&cell.auc)?true:false

			//цена
			cell_spr.price.visible=cell.level>0?false:true
			cell_spr.level_icon.texture=level_to_s_icon[cell.level||0]

		}

	},

	update_country(cell){

		return

		//перепроверяем уровень 2 - если все города куплены
		const country=cells_data.filter(c=>c.country===cell.country)

		const all_level_1=country.every(c=>{return c.level===1})
		const all_level_2=country.every(c=>{return c.level===2})
		const same_owned=country.every(c=>{return c.owner===1})||country.every(c=>{return c.owner===2})

		//апгрейд на 2 уровень
		if (all_level_1&&same_owned)
			for (const city of country)
				city.level=2

		//даунгрейд на 1 уровень
		const min_level=Math.min(...country.map(c=>c.level))
		for (const city of country){
			if (city.level===2&&(!same_owned || min_level<2))
				city.level=1
		}

		for (const city of country)
			this.update_view(city)

	},

	async move_chip(chip, steps){
		
		this.move_on=1
		
		this.chip_sound_timer=setInterval(()=>{
			if(!assets.chip_go.isPlaying)
				sound.play('chip_go')
		},100)

		let cur_cell_id=chip.cell_id

		const opp_chip=objects.white_chip===chip?objects.yellow_chip:objects.white_chip

		//возвращаем отклоненный чип на пустое место
		if (chip.cell_id===opp_chip.cell_id){
			const cx=opp_chip.x
			const cy=opp_chip.y
			const tx=objects.cells[opp_chip.cell_id].x+chip_anchors[opp_chip.cell_id].dx*42
			const ty=objects.cells[opp_chip.cell_id].y+chip_anchors[opp_chip.cell_id].dy*42
			anim3.add(opp_chip,{x:[cx, tx,'linear'],y:[cy, ty,'linear']}, true, 0.15);
		}


		const player=objects.white_chip===chip?1:2
		for (let i=0;i<steps;i++){

			let next_cell_id=cur_cell_id+1

			if (next_cell_id>cells_data.length-1)
				next_cell_id=0

			const cx=chip.x
			const cy=chip.y
			const cang=chip.angle

			//зарплата
			if (next_cell_id===0){
				this.change_money(player,200)
			}

			const tar_cell=objects.cells[next_cell_id]

			const shift=next_cell_id===opp_chip.cell_id?50:38

			const tx=tar_cell.x+chip_anchors[next_cell_id].dx*shift
			const ty=tar_cell.y+chip_anchors[next_cell_id].dy*shift

			await anim3.add(chip,{x:[cx, tx,'linear'],y:[cy, ty,'linear']}, true, 0.15);

			cur_cell_id=next_cell_id

		}

		chip.cell_id=cur_cell_id

		const cell=cells_data[cur_cell_id]
		const cur_player=chip===objects.white_chip?1:2
		const opp_player=3-cur_player
		
		this.move_on=0
		timer.resume()
		clearInterval(this.chip_sound_timer)

		//расчет ренты за участок соперника
		if (cell.owner===opp_player){

			if (cell.type==='city'){
				
				
				if (cell.owner===1){
					//оппонент приземлился на мой участок
					if (this.opp_no_rent_bonus){
						game_msgs.add('Соперник не платит ренту')
						sound.play('norent')
					}else{
						this.change_money(cur_player,-cell.rent[cell.level])
						this.change_money(opp_player,+cell.rent[cell.level])
						game_msgs.add(`Получите ренту: ${cell.rent[cell.level]}$`)
						sound.play('rent')
					}

				}
				
				if (cell.owner===2){
					//я приземлился на участок соперника
					if(this.my_no_rent_bonus){
						sys_msg.add('Вы не платите ренту')
						sound.play('norent')
					}else{
						this.change_money(cur_player,-cell.rent[cell.level])
						this.change_money(opp_player,+cell.rent[cell.level])
						game_msgs.add(`Чужой город! Заплатите ренту: ${cell.rent[cell.level]}$`)
						sound.play('rent')
					}
				}

			}

		}

		//обнуляем бонусы
		if (cur_player===1&&this.my_no_rent_bonus) this.my_no_rent_bonus--
		if (cur_player===2&&this.opp_no_rent_bonus) this.opp_no_rent_bonus--

		//можно покупать и продавать что захочешь
		if (cur_player===1) my_turn_started=1

		//мой город
		if (cell.owner===cur_player){
			//do nothing
		}

		//свободная клетка
		if (cell.price&&cell.owner===0){

			if (cell.auc){
				if (cur_player===1)
					auc.activate(cell,'on_my_bid')

				if (cur_player===2&&opponent!==bot_game)
					auc.activate(cell,'on_opp_bid')

			}else{
				if (cur_player===1){
					if (cell.type==='city')
						city_dlg.show(cell.id)
				}
			}
		}
		
		//передаем сопернику обработку хода так как ход соперника
		if (cur_player===2){
			opponent.process_move(cell)
			return
		}
		
		//казино
		if (cell.type==='casino'){
			if(cur_player===1)
				casino.activate()
		}

		//цели
		if (cell.type==='?'){
			if(cur_player===1)
				plans.activate()
		}

		//завершение хода
		if (cur_player===1){
			objects.roll_dice_btn.visible=false
			anim3.add(objects.end_turn_btn,{scale_xy:[0.3,0.666,'easeOutBack'],alpha:[0,1,'linear']}, true, 0.15);
		}


	},

	process_opp_move(move_data){
		console.log(move_data)
		
		//ход получен значит соперник подтвердил
		opponent.opp_conf_play=1
		
		//ждем завершения прежде чем обрабатывать ход
		if (this.move_on||dice.roll_on){
			console.log('в очереди ',move_data)
			setTimeout(()=>{this.process_opp_move(move_data)},250)
			return;
		}

		if (move_data.type==='roll'){
			dice.roll_and_go(objects.yellow_chip,move_data.roll_res)
		}

		if (move_data.type==='buy'){
			const cell=cells_data[move_data.cell_id]
			this.buy(2,cell)
		}

		if (move_data.type==='sell'){
			const cell=cells_data[move_data.cell_id]
			common.sell(2,cell)
		}

		if (move_data.type==='fin'){
			common.opp_fin_move_event()
		}

		if (move_data.type==='casino_accept'){
			sys_msg.add('Соперник играет в казино...')
		}

		if (move_data.type==='casino_decline'){
			game_msgs.add('Соперник отказался от казино...')
		}

		if (move_data.type==='casino_result'){
			
			if (move_data.result===0){
				game_msgs.add('Соперник выиграл 300 $ в казино')
				common.change_money(2,300)
			}
			if (move_data.result===1){
				game_msgs.add('Соперник проиграл 300 $ в казино')
				common.change_money(2,-300)
			}
			if (move_data.result===2){
				if (move_data.city_id){
					const empty_city=cells_data[move_data.city_id]
					common.remove_empty_city(empty_city)				
					game_msgs.add('Соперник потреял город '+empty_city?.rus_name)
				}else{
					game_msgs.add('Соперник чуть не потерял город в казино')
				}
			}
			if (move_data.result===3){
				if (move_data.city_id){
					const empty_city=cells_data[move_data.city_id]
					common.capture_empty_city(empty_city)
					game_msgs.add('Соперник захватил Ваш город '+empty_city?.rus_name)					
					
				}else{
					sys_msg.add('Соперник не смог захватить Ваш город')
				}

			}
			if (move_data.result===4){
				sys_msg.add('Соперник может купить любой город')
			}
			if (move_data.result===5){
				sys_msg.add('Соперник не платит ренту 3 хода!')
				common.opp_no_rent_bonus=3
			}
		}

		if (move_data.type==='exch'){
			exch.activate(move_data)
		}

		if (move_data.type==='plan'){
			this.opp_activated_plan(move_data)
		}

		if (move_data.type==='exch_decline'){
			exch.opp_decline()
		}

		if (move_data.type==='exch_approve'){
			exch.opp_approve()
		}

	},

	opp_activated_plan(data){
		//активация плана

		if (data.id===-1)
			game_msgs.add('Соперник доработал план!')
		
		if (data.id===0){

			const city_cell=cells_data[data.city_id]
			const city_name=city_cell.rus_name
			common.capture_empty_city(city_cell)
			game_msgs.add('Соперник реализовал план ВОЙНА и захватил Ваш город ('+city_name+')')
		}

		if (data.id===1){
			common.set_money(1,-300)
			game_msgs.add('Соперник достигли цели КРАЖА, ваш баланс -300$')
		}

		if (data.id===2){
			common.change_money(2,2000)
			game_msgs.add('Соперник достигл цели НАСЛЕДСТВО и получил 2000$')
		}

		if (data.id===100){
			common.change_money(2,100)
			game_msgs.add('Соперник забрал 100 $ вместо достижения цели')
		}

	},

	opp_fin_move_event(){

		sound.play('roll_btn')
		anim3.add(objects.roll_dice_btn,{scale_xy:[0.3, 0.666,'easeOutBack']}, true, 0.25);
		objects.roll_dice_btn.tint=objects.roll_dice_btn.base_tint
		my_turn=1
		timer.start()
	},
	
	get_empty_cities(player){
	
		//вычисляем незастроенные города и не монополизированных стран
		const empty_cities=[]
		for (let cell of cells_data){
			if(cell.owner===player&&cell.level===1){
				const country=cells_data.filter(d=>d.country===cell.country)
				const no_monopolised=country.some(c=>{return c.owner!==player})
				if (no_monopolised)
					empty_cities.push(cell)
			}
		}
		return empty_cities
	},
	
	remove_empty_city(city_cell){
		
		//убираем владельца города
		city_cell.owner=0
		city_cell.level=0
		this.update_view(city_cell)
		
		//анимация
		anim3.add(objects.cells[city_cell.id],{scale_xy:[1,1.1,'ease2back']}, true, 0.6)
		
	},
	
	capture_empty_city(cell){
		
		//меняем владельца горда
		sound.play('capture_city')
		cell.owner=3-cell.owner
		this.update_view(cell)
		
		
		//проверяем монополию для звука и подстветки всей монополии
		const country=cells_data.filter(c=>c.country===cell.country)
		const is_monopoly=country.every(c=>{return c.level===1&&c.owner===cell.owner})
		if (is_monopoly) {
			sound.play('monopoly')
			for (let city of country){
				const cell_spr=objects.cells[city.id]
				anim3.add(cell_spr.hl,{alpha:[0, 1,'ease2back']}, true, 2);
			}
		}
		
		//анимация
		anim3.add(objects.cells[cell.id],{scale_xy:[1,1.2,'ease2back']}, true, 0.6)
	},

	change_money(player,amount){

		sound.play('money')
		if (player===1){
			my_data.money+=amount
			objects.my_card_money.text=my_data.money+'$'
		}

		if (player===2){
			opp_data.money+=amount
			objects.opp_card_money.text=opp_data.money+'$'
		}
	},

	set_money(player, amount){

		if (player===1){
			my_data.money=amount
			objects.my_card_money.text=my_data.money+'$'
		}

		if (player===2){
			opp_data.money=amount
			objects.opp_card_money.text=opp_data.money+'$'
		}
	},

	place_chip(chip, cell_id){

		const shift=chip===objects.yellow_chip?50:38

		chip.cell_id=cell_id
		chip.x=objects.cells[cell_id].x+chip_anchors[cell_id].dx*shift
		chip.y=objects.cells[cell_id].y+chip_anchors[cell_id].dy*shift
		chip.angle=chip_anchors[cell_id].ang

	},

	buy(player,cell,prc){

		if (cell.type==='city'){

			const price=prc||(cell.level>0?cell.house_cost:cell.price)
			cell.owner=player
			this.change_money(player,-price)
			
			cell.level++
			
			this.casino_buy_bonus=0
			
			//анимация
			anim3.add(objects.cells[cell.id],{scale_xy:[1,1.1,'ease2back']}, true, 0.6)
			
			//проверяем монополию для звука и подстветки всей монополии
			const country=cells_data.filter(c=>c.country===cell.country)
			const is_monopoly=country.every(c=>{return c.level===1&&c.owner===cell.owner})
			if (is_monopoly) {
				sound.play('monopoly')
				for (let city of country){
					const cell_spr=objects.cells[city.id]
					anim3.add(cell_spr.hl,{alpha:[0, 1,'ease2back']}, true, 2);
				}
			}
			
		
			//куплен дом
			if (cell.level>1&&cell.level<6){
				this.houses_num--
				objects.houses_info.text='Домов в банке: '+this.houses_num
			}

			//куплен отель, 4 дома вернули в банк
			if (cell.level===6){
				this.houses_num+=4
				objects.houses_info.text='Домов в банке: '+this.houses_num
				sound.play('hotel_buy')
			}else{
				sound.play('buy')
			}

			//обновляем всю страну так как там тоже могло поменяться
			//this.update_country(cell)
			this.update_view(cell)

			//если не от аукциона
			if(!prc){
				if (player===2)
					game_msgs.add('Соперник купил '+['','город','дом','дом','дом','дом','отель'][cell.level] +' ('+ cell.rus_name +')')
				else
					game_msgs.add('Вы купили '+['','город','дом','дом','дом','дом','отель'][cell.level] +' ('+ cell.rus_name +')')
			}


		}

	},

	sell(player,cell){

		if (cell.type==='city'){

			if (player===2)
				game_msgs.add('Соперник продал '+['','город','дом','дом','дом','дом','отель'][cell.level] +' ('+ cell.rus_name +')')
			else
				game_msgs.add('Вы продали '+['','город','дом','дом','дом','дом','отель'][cell.level] +' ('+ cell.rus_name +')')

			sound.play('sell')

			//продан отель, получаем дома из банка
			if (cell.level===6) {
				this.houses_num-=4
				objects.houses_info.text='Домов в банке: '+this.houses_num
			}

			//продан дом, возвращаем дома в банк
			if (cell.level>1&&cell.level<6){
				this.houses_num++
				objects.houses_info.text='Домов в банке: '+this.houses_num
			}


			cell.level--
			
			//анимация
			anim3.add(objects.cells[cell.id],{scale_xy:[1,1.1,'ease2back']}, true, 0.6)

			if(!cell.level) cell.owner=0

			const price=Math.round((cell.level>1?cell.house_cost:cell.price)*0.5)
			this.change_money(player,price)

			//обновляем всю страну так как там тоже могло поменяться

			this.update_view(cell)

		}
	},
	
	async stop(res){
		
		this.on=0
		timer.stop()
				
		await opponent.stop(res)
		

		//обновляем почтовый ящик
		fbs.ref('inbox/'+my_data.uid).remove()
		
		objects.timer_cont.visible=false
		anim3.add(objects.my_card_cont,{x:[objects.my_card_cont.x,-200,'linear']},false,0.3)
		anim3.add(objects.opp_card_cont,{x:[objects.opp_card_cont.x,800,'linear']}, false,0.3)
		objects.cells_cont.visible=false
		lobby.activate()
		
	}


}

vk={

	invite_button_down(){
		if (anim3.any_on()) return;

		sound.play('click');
		vkBridge.send('VKWebAppShowInviteBox');
		anim3.add(objects.vk_buttons_cont,{y:[objects.vk_buttons_cont.y,-150,'linear']}, false, 0.75);

	},

	share_button_down(){

		if (anim3.any_on()) return;

		sound.play('click');
		vkBridge.send('VKWebAppShowWallPostBox', { message: 'Я играю в Эко Бильард Онлайн и мне нравится!','attachments': 'https://vk.com/app53480594'})
		anim3.add(objects.vk_buttons_cont,{y:[objects.vk_buttons_cont.y,-150,'linear']}, false, 0.75);

	}


}

main_menu={
	
	prv_anim_tm:0,
	prv_bliq_tm:0,

	async activate() {

		//проверяем и включаем музыку
		//music.activate();
		objects.main_menu_cont.visible=true;


		objects.bcg.texture=assets.main_bcg;
		anim3.add(objects.bcg,{alpha:[0,1,'linear']}, true, 0.5);

		anim3.add(objects.main_menu_cont,{alpha:[0,1,'linear']}, true, 0.5);

		anim3.add(objects.title_online,{x:[850,objects.title_online.sx,'easeOutBack']}, true, 0.5);

		this.prv_anim_tm=Date.now()
		this.prv_bliq_tm=Date.now()

		if (game_platform==='VK')
			anim3.add(objects.vk_buttons_cont,{alpha:[0,1,'linear']}, true, 0.5);

		this.process_timer=setInterval(()=>{this.process()},100)
	
		
		//кнопки
		await anim3.add(objects.main_btn_cont,{x:[800,objects.main_btn_cont.sx,'linear'],alpha:[0,1,'linear']}, true, 0.75);

	},

	process(){

		const tm=Date.now()
		
		if (tm-this.prv_anim_tm>2000){
			
			
			const head_tar_ang=irnd(-15,15)
			const head_rand_and=Math.random()*6.2831853
			const head_tar_x=objects.uncle_head.sx+Math.sin(head_rand_and)*10
			const head_tar_y=objects.uncle_head.sy+Math.cos(head_rand_and)*10
			const head_tar_s=Math.random()*0.2+0.6666-0.1
			
			anim3.add(objects.uncle_head,{scale_xy:[objects.uncle_head.scale_xy,head_tar_s,'linear'],x:[objects.uncle_head.x, head_tar_x,'linear'],y:[objects.uncle_head.y, head_tar_y,'linear'],angle:[objects.uncle_head.angle, head_tar_ang,'linear']}, true, 0.5,false)
			anim3.add(objects.uncle_hands,{x:[objects.uncle_hands.x, head_tar_x,'linear'],scale_x:[0.6666,0.62,'ease2back']}, true, 0.5,false)
						
			this.prv_anim_tm=tm
			
		}
		
		if (tm-this.prv_bliq_tm>2500){
			anim3.add(objects.main_title_blique,{x:[-20, 800,'linear']}, false, 0.6,false)
			this.prv_bliq_tm=tm
		}

	},

	ball_touched(ball,D){

		if (anim3.any_on()) {
			sound.play('locked');
			return
		};

		const curx=ball.x;
		const cur_rot=ball.rotation;

		let tar_x=0;
		let tar_rot=0;

		if (curx>400){
			ball.spd=-irnd(1,7);
		}else{
			ball.spd=irnd(1,7);;
		}

	},

	async close() {

		//игровой титл

		//anim3.add(objects.bcg,{alpha:[1,0]}, false, 0.5,'linear');

		anim3.add(objects.main_btn_cont,{x:[objects.main_btn_cont.x,-800,'linear']}, false, 0.5);

		//кнопки
		anim3.add(objects.main_menu_cont,{alpha:[1,0,'linear']}, false, 0.5);

		clearInterval(this.process_timer)

		//vk
		//if(objects.vk_buttons_cont.visible)
		//	anim3.add(objects.vk_buttons_cont,{alpha:[1,0,'linear']}, false, 0.25);

	},

	async sp_btn_down () {

		if (anim3.any_on()) {
			sound.play('locked');
			return
		};

		sound.play('click')

		await this.close()



		opp_data.uid='bot';
		opp_data.name=['Бот','Bot'][LANG];
		opp_data.rating=1400;

		bot_game.activate()

	},

	async online_btn_down () {

		if (anim3.any_on()) {
			sound.play('locked');
			return
		};

		/*if (!levels.stat||!levels.stat.length) {
			sys_msg.add('Пройдите туториал в одиночной игре для доступа')
			anim3.add(objects.sp_btn,{scale_xy:[0.666, 1,'ease2back'],angle:[0,10,'ease2back']}, true, 0.25);
			return
		};*/

		sound.play('click');

		await this.close();
		//levels.activate();
		lobby.activate();

	},

	async lb_btn_down() {

		if (anim3.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('click');

		await this.close();
		lb.show();

	},

	instr_btn_down(){

		if (anim3.any_on()) {
			sound.play('locked');
			return
		};

		sound.play('click');

		this.close();
		instr.activate();

	},

	pref_btn_down () {

		if (anim3.any_on()) {
			sound.play('locked');
			return
		};

		sound.play('click');

		this.close();
		pref.activate();

	},

	rules_ok_down () {

		if (anim3.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('close_it');

		anim3.add(objects.rules,{y:[objects.rules.sy, -450,'easeInBack']}, false, 0.5);

	},


}

lobby={

	state_tint :{},
	_opp_data : {},
	activated:false,
	rejected_invites:{},
	fb_cache:{},
	first_run:0,
	on:0,
	global_players:{},
	state_listener_on:0,
	state_listener_timeout:0,

	activate(room) {

		//первый запуск лобби
		if (!this.activated){
			//расставляем по соответствующим координатам

			for(let i=0;i<objects.mini_cards.length;i++) {

				const iy=i%4;
				objects.mini_cards[i].y=50+iy*80;

				let ix;
				if (i>15) {
					ix=~~((i-16)/4)
					objects.mini_cards[i].x=815+ix*190;
				}else{
					ix=~~((i)/4)
					objects.mini_cards[i].x=15+ix*190;
				}
			}

			this.activated=true;

		}

		//добавляем бота
		this.add_card_ai();


		//objects.bcg.texture=assets.lobby_bcg_img;
		anim3.add(objects.bcg,{alpha:[0,1,'linear']}, true, 0.5);
		anim3.add(objects.cards_cont,{alpha:[0, 1,'linear']}, true, 0.1);
		anim3.add(objects.lobby_footer_cont,{y:[450, objects.lobby_footer_cont.sy,'linear']}, true, 0.1);
		anim3.add(objects.lobby_header_cont,{y:[-50, objects.lobby_header_cont.sy,'linear']}, true, 0.1);
		objects.cards_cont.x=0;
		this.on=1;

		//отключаем все карточки
		for(let i=this.starting_card;i<objects.mini_cards.length;i++)
			objects.mini_cards[i].visible=false;

		//процессинг
		some_process.lobby=function(){lobby.process()};


		//убираем старое и подписываемся на новую комнату
		if (room){
			if(room_name){
				fbs.ref(room_name).off();
				fbs.ref(room_name+'/'+my_data.uid).remove();
				this.global_players={};
				this.state_listener_on=0;
			}
			room_name=room;
		}

		//удаляем таймаут слушателя комнаты
		clearTimeout(this.state_listener_timeout);

		this.players_list_updated(this.global_players);

		//включаем прослушивание если надо
		if (!this.state_listener_on){

			//console.log('Подключаем прослушивание...');
			fbs.ref(room_name).on('child_changed', snapshot => {
				const val=snapshot.val()
				//console.log('child_changed',snapshot.key,val,JSON.stringify(val).length)
				this.global_players[snapshot.key]=val;
				lobby.players_list_updated(this.global_players);
			});
			fbs.ref(room_name).on('child_added', snapshot => {
				const val=snapshot.val()
				//console.log('child_added',snapshot.key,val,JSON.stringify(val).length)
				this.global_players[snapshot.key]=val;
				lobby.players_list_updated(this.global_players);
			});
			fbs.ref(room_name).on('child_removed', snapshot => {
				const val=snapshot.val()
				//console.log('child_removed',snapshot.key,val,JSON.stringify(val).length)
				delete this.global_players[snapshot.key];
				lobby.players_list_updated(this.global_players);
			});

			fbs.ref(room_name+'/'+my_data.uid).onDisconnect().remove();

			this.state_listener_on=1;
		}

		set_state({state : 'o'});
		
		
		objects.bcg.texture=assets.lobby_bcg

		//создаем заголовки
		const room_desc=['КОМНАТА #','ROOM #'][LANG]+room_name.slice(6);
		objects.t_room_name.text=room_desc;

	},

	pref_btn_down(){

		//если какая-то анимация
		if (anim3.any_on()) {
			sound.play('locked')
			return
		};

		sound.play('click')

		//подсветка
		objects.lobby_btn_hl.x=objects.lobby_pref_btn.x
		objects.lobby_btn_hl.y=objects.lobby_pref_btn.y
		anim3.add(objects.lobby_btn_hl,{alpha:[0,1,'ease3peaks']}, false, 0.25,false)

		//убираем контейнер
		anim3.add(objects.cards_cont,{x:[objects.cards_cont.x,800,'linear']}, false, 0.2)
		anim3.add(objects.pref_cont,{x:[-800,objects.pref_cont.sx,'linear']}, true, 0.4)

		//меняем футер
		anim3.add(objects.lobby_header_cont,{y:[objects.lobby_header_cont.y,-100,'linear']}, false, 0.2)
		anim3.add(objects.lobby_footer_cont,{y:[objects.lobby_footer_cont.sy,450,'linear']}, true, 0.2)
		anim3.add(objects.pref_footer_cont,{y:[450,objects.pref_footer_cont.sy,'linear']}, true, 0.4)
		pref.activate();

	},

	players_list_updated(players) {


		//console.log('DATA:',JSON.stringify(data).length);
		//console.log(new Date(Date.now()).toLocaleTimeString());
		//если мы в игре то пока не обновляем карточки
		//if (state==='p'||state==='b')
		//	return;

		//это столы
		let tables = {};

		//это свободные игроки
		let single = {};

		//удаляем инвалидных игроков
		for (let uid in players){
			if(!players[uid].name||!players[uid].rating||!players[uid].state)
				delete players[uid];
		}

		//делаем дополнительный объект с игроками и расширяем id соперника
		let p_data = JSON.parse(JSON.stringify(players));

		//создаем массив свободных игроков и обновляем кэш
		for (let uid in players){

			const player=players[uid];

			//обновляем кэш с первыми данными
			players_cache.update(uid,{name:player.name,rating:player.rating,hidden:player.hidden});

			if (player.state!=='p'&&!player.hidden)
				single[uid] = player.name;
		}

		//оставляем только тех кто за столом
		for (let uid in p_data)
			if (p_data[uid].state !== 'p')
				delete p_data[uid];

		//дополняем полными ид оппонента
		for (let uid in p_data) {
			const small_opp_id = p_data[uid].opp_id;
			//проходимся по соперникам
			for (let uid2 in players) {
				let s_id=uid2.substring(0,10);
				if (small_opp_id === s_id) {
					//дополняем полным id
					p_data[uid].opp_id = uid2;
				}
			}
		}

		//определяем столы
		for (let uid in p_data) {
			const opp_id = p_data[uid].opp_id;
			if (p_data[opp_id]) {
				if (uid === p_data[opp_id].opp_id && !tables[uid]) {
					tables[uid] = opp_id;
					delete p_data[opp_id];
				}
			}
		}

		//считаем сколько одиночных игроков и сколько столов
		const num_of_single = Object.keys(single).length;
		const num_of_tables = Object.keys(tables).length;
		const num_of_cards = num_of_single + num_of_tables;

		//если карточек слишком много то убираем столы
		if (num_of_cards > objects.mini_cards.length) {
			const num_of_tables_cut = num_of_tables - (num_of_cards - objects.mini_cards.length);
			const num_of_tables_to_cut = num_of_tables - num_of_tables_cut;

			//удаляем столы которые не помещаются
			const t_keys = Object.keys(tables);
			for (let i = 0 ; i < num_of_tables_to_cut ; i++) {
				delete tables[t_keys[i]];
			}
		}

		//убираем карточки пропавших игроков и обновляем карточки оставшихся
		for(let i=this.starting_card;i<objects.mini_cards.length;i++) {
			if (objects.mini_cards[i].visible === true && objects.mini_cards[i].type === 'single') {
				const card_uid = objects.mini_cards[i].uid;
				if (single[card_uid] === undefined)
					objects.mini_cards[i].visible = false;
				else
					this.update_existing_card({id:i, state:players[card_uid].state, rating:players[card_uid].rating, name:players[card_uid].name});
			}
		}

		//определяем новых игроков которых нужно добавить
		new_single = {};

		for (let p in single) {

			let found = 0;
			for(let i=0;i<objects.mini_cards.length;i++) {

				if (objects.mini_cards[i].visible === true && objects.mini_cards[i].type === 'single') {
					if (p ===  objects.mini_cards[i].uid) {
						found = 1;
					}
				}
			}

			if (found === 0)
				new_single[p] = single[p];
		}

		//убираем исчезнувшие столы (если их нет в новом перечне) и оставляем новые
		for(let i=this.starting_card;i<objects.mini_cards.length;i++) {

			if (objects.mini_cards[i].visible && objects.mini_cards[i].type === 'table') {

				const uid1 = objects.mini_cards[i].uid1;
				const uid2 = objects.mini_cards[i].uid2;

				let found = 0;

				for (let t in tables) {
					const t_uid1 = t;
					const t_uid2 = tables[t];
					if (uid1 === t_uid1 && uid2 === t_uid2) {
						delete tables[t];
						found = 1;
					}
				}

				if (found === 0)
					objects.mini_cards[i].visible = false;
			}
		}

		//размещаем на свободных ячейках новых игроков
		for (let uid in new_single)
			this.place_new_card({uid, state:players[uid].state, name : players[uid].name,  rating : players[uid].rating});

		//размещаем НОВЫЕ столы где свободно
		for (let uid in tables) {
			const name1=players[uid].name
			const name2=players[tables[uid]].name

			const rating1= players[uid].rating
			const rating2= players[tables[uid]].rating

			const game_id=players[uid].game_id;
			this.place_table({uid1:uid,uid2:tables[uid],name1, name2, rating1, rating2,game_id});
		}

	},

	add_card_ai() {

		this.starting_card=1
		const card=objects.mini_cards[0]

		//убираем элементы стола так как они не нужны
		card.rating_text1.visible = false;
		card.rating_text2.visible = false;
		card.avatar1.visible = false;
		card.avatar2.visible = false;
		card.avatar1_frame.visible = false;
		card.avatar2_frame.visible = false;
		card.table_rating_hl.visible = false;
		card.bcg.texture=assets.mini_player_card_ai;

		card.visible=true;
		card.uid='bot';
		card.name=card.name_text.text=['Бот','Bot'][LANG];

		card.rating=1400;
		card.rating_text.text = card.rating;
		card.avatar.set_texture(assets.pc_icon);

		//также сразу включаем его в кэш
		if(!players_cache.players.bot){
			players_cache.players.bot={};
			players_cache.players.bot.name=['Бот','Bot'][LANG];
			players_cache.players.bot.rating=1400;
			players_cache.players.bot.texture=assets.pc_icon;
		}
	},

	get_state_texture(s,uid) {

		switch(s) {

			case 'o':
				return assets.mini_player_card;
			break;

			case 'b':
				return assets.mini_player_card_bot;
			break;

			case 'p':
				return assets.mini_player_card;
			break;

			case 'b':
				return assets.mini_player_card;
			break;

		}
	},

	place_table(params={uid1:0,uid2:0,name1: 'X',name2:'X', rating1: 1400, rating2: 1400,game_id:0}) {


		for(let i=this.starting_card;i<objects.mini_cards.length;i++) {

			const card=objects.mini_cards[i];

			//это если есть вакантная карточка
			if (!card.visible) {

				//устанавливаем цвет карточки в зависимости от состояния
				card.bcg.texture=this.get_state_texture(params.state);
				card.state=params.state;

				card.type = "table";

				card.bcg.texture = assets.mini_player_card_table;

				//присваиваем карточке данные
				//card.uid=params.uid;
				card.uid1=params.uid1;
				card.uid2=params.uid2;

				//убираем элементы свободного стола
				card.rating_text.visible = false;
				card.avatar.visible = false;
				card.avatar_frame.visible = false;
				card.avatar1_frame.visible = false;
				card.avatar2_frame.visible = false;
				card.name_text.visible = false;

				//Включаем элементы стола
				card.table_rating_hl.visible=true;
				card.rating_text1.visible = true;
				card.rating_text2.visible = true;
				card.avatar1.visible = true;
				card.avatar2.visible = true;
				card.avatar1_frame.visible = true;
				card.avatar2_frame.visible = true;
				//card.rating_bcg.visible = true;

				card.rating_text1.text = params.rating1;
				card.rating_text2.text = params.rating2;

				card.name1 = params.name1;
				card.name2 = params.name2;

				//получаем аватар и загружаем его
				this.load_avatar2({uid:params.uid1, tar_obj:card.avatar1});

				//получаем аватар и загружаем его
				this.load_avatar2({uid:params.uid2, tar_obj:card.avatar2});


				card.visible=true;
				card.game_id=params.game_id;

				break;
			}
		}

	},

	update_existing_card(params={id:0, state:'o' , rating:1400, name:''}) {

		//устанавливаем цвет карточки в зависимости от состояния( аватар не поменялись)
		const card=objects.mini_cards[params.id];
		card.bcg.texture=this.get_state_texture(params.state,card.uid);
		card.state=params.state;

		card.name_text.set2(params.name,105);
		card.rating=params.rating;
		card.rating_text.text=params.rating;
		card.visible=true;
	},

	place_new_card(params={uid:0, state: 'o', name:'X ', rating: rating}) {

		for(let i=this.starting_card;i<objects.mini_cards.length;i++) {

			//ссылка на карточку
			const card=objects.mini_cards[i];

			//это если есть вакантная карточка
			if (!card.visible) {

				//устанавливаем цвет карточки в зависимости от состояния
				card.bcg.texture=this.get_state_texture(params.state,params.uid);
				card.state=params.state;

				card.type = 'single';

				//присваиваем карточке данные
				card.uid=params.uid;

				//убираем элементы стола так как они не нужны
				card.rating_text1.visible = false;
				card.rating_text2.visible = false;
				card.avatar1.visible = false;
				card.avatar2.visible = false;
				card.avatar1_frame.visible = false;
				card.avatar2_frame.visible = false;
				card.table_rating_hl.visible=false;

				//включаем элементы одиночной карточки
				card.rating_text.visible = true;
				card.avatar.visible = true;
				card.avatar_frame.visible = true;
				card.name_text.visible = true;

				card.name=params.name;
				card.name_text.set2(params.name,105);
				card.rating=params.rating;
				card.rating_text.text=params.rating;

				card.visible=true;


				//получаем аватар и загружаем его
				this.load_avatar2({uid:params.uid, tar_obj:card.avatar});

				//console.log(`новая карточка ${i} ${params.uid}`)
				return;
			}
		}

	},

	async load_avatar2 (params={}) {

		//обновляем или загружаем аватарку
		await players_cache.update_avatar(params.uid);

		//устанавливаем если это еще та же карточка
		params.tar_obj.set_texture(players_cache.players[params.uid].texture);
	},

	card_down(card_id) {

		if (objects.mini_cards[card_id].type === 'single')
			this.show_invite_dialog(card_id);

		if (objects.mini_cards[card_id].type === 'table')
			this.show_table_dialog(card_id);

	},

	show_table_dialog(card_id) {


		//если какая-то анимация или открыт диалог
		if (anim3.any_on() || pending_player!=='') {
			sound.play('locked');
			return
		};

		sound.play('click');
		//закрываем диалог стола если он открыт
		if(objects.invite_cont.visible) this.close_invite_dialog();

		anim3.add(objects.td_cont,{x:[800, objects.td_cont.sx,'linear']}, true, 0.1);

		const card=objects.mini_cards[card_id];

		objects.td_cont.card=card;

		objects.td_avatar1.set_texture(players_cache.players[card.uid1].texture);
		objects.td_avatar2.set_texture(players_cache.players[card.uid2].texture);

		objects.td_rating1.text = card.rating_text1.text;
		objects.td_rating2.text = card.rating_text2.text;

		objects.td_name1.set2(card.name1, 220);
		objects.td_name2.set2(card.name2, 220);

	},

	close_table_dialog() {
		sound.play('click');
		anim3.add(objects.td_cont,{x:[objects.td_cont.x, 800,'linear']}, false, 0.1);
	},

	show_invite_dialog(card_id) {

		//если какая-то анимация или уже сделали запрос
		if (anim3.any_on() || pending_player!=='') {
			sound.play('locked');
			return
		};

		//закрываем диалог стола если он открыт
		if(objects.td_cont.visible) this.close_table_dialog();

		pending_player="";

		sound.play('click');

		objects.invite_feedback.text = '';

		//показыаем кнопку приглашения
		objects.invite_button.texture=assets.invite_button;

		anim3.add(objects.invite_cont,{x:[800, objects.invite_cont.sx,'linear']}, true, 0.15);

		const card=objects.mini_cards[card_id];

		//копируем предварительные данные
		lobby._opp_data = {uid:card.uid,name:card.name,rating:card.rating};


		this.show_feedbacks(lobby._opp_data.uid);


		let invite_available=lobby._opp_data.uid !== my_data.uid;
		invite_available=invite_available && (card.state==="o" || card.state==="b");
		invite_available=invite_available || lobby._opp_data.uid==='bot';
		invite_available=invite_available && lobby._opp_data.rating >= 50 && my_data.rating >= 50;

		//кнопка удаления комментариев
		objects.fb_delete_button.visible=my_data.uid===lobby._opp_data.uid;

		//если мы в списке игроков которые нас недавно отврегли
		if (this.rejected_invites[lobby._opp_data.uid] && Date.now()-this.rejected_invites[lobby._opp_data.uid]<60000) invite_available=false;

		//показыаем кнопку приглашения только если это допустимо
		objects.invite_button.visible=invite_available;

		//заполняем карточу приглашения данными

		objects.invite_avatar.set_texture(players_cache.players[card.uid].texture);
		objects.invite_name.set2(lobby._opp_data.name,230);
		objects.invite_rating.text=card.rating_text.text;

	},

	fb_delete_down(){

		objects.fb_delete_button.visible=false;
		fbs.ref('fb/' + my_data.uid).remove();
		this.fb_cache[my_data.uid].fb_obj={0:[['***нет отзывов***','***no feedback***'][LANG],999,' ']};
		this.fb_cache[my_data.uid].tm=Date.now();
		objects.feedback_records.forEach(fb=>fb.visible=false);

		message.add(['Отзывы удалены','Feedbacks are removed'][LANG])

	},

	async show_invite_dialog_from_chat(uid,name) {

		//если какая-то анимация или уже сделали запрос
		if (anim3.any_on() || pending_player!=='') {
			sound.play('locked');
			return
		};

		//закрываем диалог стола если он открыт
		if(objects.td_cont.visible) this.close_table_dialog();

		pending_player="";

		sound.play('click');

		objects.invite_feedback.text = '';

		//показыаем кнопку приглашения
		objects.invite_button.texture=assets.invite_button;

		anim3.add(objects.invite_cont,{x:[800, objects.invite_cont.sx,'linear']}, true, 0.15);

		let player_data={uid};
		//await this.update_players_cache_data(uid);

		//копируем предварительные данные
		lobby._opp_data = {uid,name:players_cache.players[uid].name,rating:players_cache.players[uid].rating};


		//фидбэки
		this.show_feedbacks(lobby._opp_data.uid);

		//кнопка удаления комментариев
		objects.fb_delete_button.visible=false;

		let invite_available = 	lobby._opp_data.uid !== my_data.uid;

		//если мы в списке игроков которые нас недавно отврегли
		if (this.rejected_invites[lobby._opp_data.uid] && Date.now()-this.rejected_invites[lobby._opp_data.uid]<60000) invite_available=false;

		//показыаем кнопку приглашения только если это допустимо
		objects.invite_button.visible=invite_available;

		//заполняем карточу приглашения данными
		objects.invite_avatar.set_texture(players_cache.players[uid].texture);
		objects.invite_name.set2(players_cache.players[uid].name,230);
		objects.invite_rating.text=players_cache.players[uid].rating;
	},

	async show_feedbacks(uid) {



		//получаем фидбэки сначала из кэша, если их там нет или они слишком старые то загружаем из фб
		let fb_obj;
		if (!this.fb_cache[uid] || (Date.now()-this.fb_cache[uid].tm)>120000) {
			let _fb = await fbs.ref("fb/" + uid).once('value');
			fb_obj =_fb.val();

			//сохраняем в кэше отзывов
			this.fb_cache[uid]={};
			this.fb_cache[uid].tm=Date.now();
			if (fb_obj){
				this.fb_cache[uid].fb_obj=fb_obj;
			}else{
				fb_obj={0:[['***нет отзывов***','***no feedback***'][LANG],999,' ']};
				this.fb_cache[uid].fb_obj=fb_obj;
			}

			//console.log('загрузили фидбэки в кэш')

		} else {
			fb_obj =this.fb_cache[uid].fb_obj;
			//console.log('фидбэки из кэша ,ура')
		}



		var fb = Object.keys(fb_obj).map((key) => [fb_obj[key][0],fb_obj[key][1],fb_obj[key][2]]);

		//сортируем отзывы по дате
		fb.sort(function(a,b) {
			return b[1]-a[1]
		});


		//сначала убираем все фидбэки
		objects.feedback_records.forEach(fb=>fb.visible=false)

		let prv_fb_bottom=0;
		const fb_cnt=Math.min(fb.length,objects.feedback_records.length);
		for (let i = 0 ; i < fb_cnt;i++) {
			const fb_place=objects.feedback_records[i];

			let sender_name =  fb[i][2] || 'Неизв.';
			if (sender_name.length > 10) sender_name = sender_name.substring(0, 10);
			fb_place.set(sender_name,fb[i][0]);


			const fb_height=fb_place.text.textHeight*0.85;
			const fb_end=prv_fb_bottom+fb_height;

			//если отзыв будет выходить за экран то больше ничего не отображаем
			const fb_end_abs=fb_end+objects.invite_cont.y+objects.invite_feedback.y;
			if (fb_end_abs>450) return;

			fb_place.visible=true;
			fb_place.y=prv_fb_bottom;
			prv_fb_bottom+=fb_height;
		}

	},

	async close() {

		if (objects.invite_cont.visible === true)
			this.close_invite_dialog();

		if (objects.td_cont.visible === true)
			this.close_table_dialog();

		some_process.lobby=function(){};

		//if (objects.pref_cont.visible)
		//	pref.close();


		//плавно все убираем
		anim3.add(objects.cards_cont,{alpha:[1, 0,'linear']}, false, 0.1);
		anim3.add(objects.lobby_footer_cont,{y:[ objects.lobby_footer_cont.y,450,'linear']}, false, 0.2);
		anim3.add(objects.lobby_header_cont,{y:[objects.lobby_header_cont.y,-50,'linear']}, false, 0.2);

		//больше ни ждем ответ ни от кого
		pending_player='';
		this.on=0;

		//отписываемся от изменений состояний пользователей через 30 секунд
		this.state_listener_timeout=setTimeout(()=>{
			fbs.ref(room_name).off();
			this.state_listener_on=0;
			//console.log('Отключаем прослушивание...');
		},30000);

	},

	async inst_message(data){

		//когда ничего не видно не принимаем сообщения
		if(!objects.cards_cont.visible) return;

		await players_cache.update(data.uid);
		await players_cache.update_avatar(data.uid);

		sound.play('inst_msg');
		anim3.add(objects.inst_msg_cont,{alpha:[0,1,'linear']},true,0.4,false);
		objects.inst_msg_avatar.texture=players_cache.players[data.uid].texture||PIXI.Texture.WHITE;
		objects.inst_msg_text.set2(data.msg,290);
		objects.inst_msg_cont.tm=Date.now();
	},

	get_room_index_from_rating(){
		//номер комнаты в зависимости от рейтинга игрока
		const rooms_bins=[0,1366,1437,1580,9999];
		let room_to_go='state1';
		for (let i=1;i<rooms_bins.length;i++){
			const f=rooms_bins[i-1];
			const t=rooms_bins[i];
			if (my_data.rating>f&&my_data.rating<=t)
				return i;
		}
		return 1;

	},

	process(){

		const tm=Date.now();
		if (objects.inst_msg_cont.visible&&objects.inst_msg_cont.ready)
			if (tm>objects.inst_msg_cont.tm+7000)
				anim3.add(objects.inst_msg_cont,{alpha:[1, 0,'linear']},false,0.4);

	},

	peek_down(){

		if (anim3.any_on()) {
			sound.play('locked');
			return
		};
		sound.play('click');
		this.close();

		//активируем просмотр игры
		game_watching.activate(objects.td_cont.card);
	},

	wheel_event(dir) {

	},

	async fb_my_down() {


		if (this._opp_data.uid !== my_data.uid || objects.feedback_cont.visible === true)
			return;

		let fb = await feedback.show(this._opp_data.uid);

		//перезагружаем отзывы если добавили один
		if (fb[0] === 'sent') {
			let fb_id = irnd(0,50);
			await fbs.ref("fb/"+this._opp_data.uid+"/"+fb_id).set([fb[1], firebase.database.ServerValue.TIMESTAMP, my_data.name]);
			this.show_feedbacks(this._opp_data.uid);
		}

	},

	close_invite_dialog() {

		sound.play('click');

		if (!objects.invite_cont.visible) return;

		//отправляем сообщение что мы уже не заинтересованы в игре
		if (pending_player!=='') {
			fbs.ref("inbox/"+pending_player).push({s:my_data.uid,m:"INV_REM",tm:Date.now()});
			pending_player='';
		}

		anim3.add(objects.invite_cont,{x:[objects.invite_cont.x, 800,'linear']}, false, 0.15);
	},

	async send_invite() {

		if (!objects.invite_cont.ready||!objects.invite_cont.visible||objects.invite_button.texture===assets.invite_wait_img){
			sound.play('locked');
			return
		};

		if (anim3.any_on()){
			sound.play('locked');
			return
		};

		if (lobby._opp_data.uid==='bot') {
			await this.close();

			opp_data.name=['Бот','Bot'][LANG];
			opp_data.uid='bot';
			opp_data.rating=1400;
			bot_game.activate()
		} else {
			sound.play('click');
			objects.invite_button.texture=assets.invite_wait_img;
			fbs.ref('inbox/'+lobby._opp_data.uid).push({s:my_data.uid,m:'INV',tm:Date.now()});
			pending_player=lobby._opp_data.uid;

		}

	},

	rejected_invite(msg) {

		this.rejected_invites[pending_player]=Date.now();
		pending_player="";
		lobby._opp_data={};
		this.close_invite_dialog();
		if(msg==='REJECT_ALL')
			sys_msg.add(['Соперник пока не принимает приглашения.','The opponent refused to play.'][LANG]);
		else
			sys_msg.add(['Соперник отказался от игры. Повторить приглашение можно через 1 минуту.','The opponent refused to play. You can repeat the invitation in 1 minute'][LANG]);

	},

	async accepted_invite(data) {


		//убираем запрос на игру если он открыт
		req_dialog.hide();

		//устанаваем окончательные данные оппонента
		opp_data=lobby._opp_data
		opp_data.cue_id=data.cue_id

		//закрываем меню и начинаем игру
		await lobby.close();
		online_game.activate(data.seed,0);
		//game2.activate('master');


	},

	chat_btn_down(){
		if (anim3.any_on()) {
			sound.play('locked');
			return
		};

		sound.play('click');

		//подсветка
		objects.lobby_btn_hl.x=objects.lobby_chat_btn.x;
		objects.lobby_btn_hl.y=objects.lobby_chat_btn.y;
		anim3.add(objects.lobby_btn_hl,{alpha:[0,1,'ease3peaks']}, false, 0.25,false);

		this.close();
		chat.activate();

	},

	quiz_btn_down(){

		if (anim3.any_on()) {
			sound.play('locked');
			return
		};

		//sound.play('locked');
		//return

		sound.play('click');

		//подсветка
		objects.lobby_btn_hl.x=objects.lobby_quiz_btn.x;
		objects.lobby_btn_hl.y=objects.lobby_quiz_btn.y;
		anim3.add(objects.lobby_btn_hl,{alpha:[0,1,'ease3peaks']}, false, 0.25,false);

		this.close();
		quiz.activate();
	},

	async lb_btn_down() {

		if (anim3.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('click');

		//подсветка
		objects.lobby_btn_hl.x=objects.lobby_lb_btn.x;
		objects.lobby_btn_hl.y=objects.lobby_lb_btn.y;
		anim3.add(objects.lobby_btn_hl,{alpha:[0,1,'ease3peaks']}, false, 0.25,false);


		await this.close();
		lb.show();
	},

	list_btn_down(dir){

		if (anim3.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('click');
		const cur_x=objects.cards_cont.x;
		const new_x=cur_x-dir*800;


		//подсветка
		const tar_btn={'-1':objects.lobby_left_btn,'1':objects.lobby_right_btn}[dir];
		objects.lobby_btn_hl.x=tar_btn.x;
		objects.lobby_btn_hl.y=tar_btn.y;
		anim3.add(objects.lobby_btn_hl,{alpha:[0,1,'ease3peaks']}, false, 0.25,false);


		if (new_x>0 || new_x<-800) {
			sound.play('locked');
			return
		}

		anim3.add(objects.cards_cont,{x:[cur_x, new_x,'easeInOutCubic']},true,0.2);
	},

	async back_btn_down() {

		if (anim3.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('click');

		await this.close();
		main_menu.activate();

	},

	info_btn_down(){

		if (anim3.any_on()) {
			sound.play('locked');
			return
		};
		sound.play('click');

		if(!objects.info_cont.init){

			objects.info_records[0].set({uid:'bot',name:'Админ',msg:'Новое правило - рейтинг игроков, неактивных более 5 дней, будет снижен до 2000.',tm:1734959027520})
			objects.info_records[0].scale_xy=1.2;
			objects.info_records[0].y=145;

			objects.info_records[1].set({uid:'bot',name:'Админ',msg:'Новое правило - не авторизованным игрокам не доступен рейтинг более 2000.',tm:1734959227520})
			objects.info_records[1].scale_xy=1.2;
			objects.info_records[1].y=235;

			objects.info_cont.init=1;
		}

		anim3.add(objects.info_cont,{alpha:[0,1,'linear']}, true, 0.25);

	},

	info_close_down(){

		if (anim3.any_on()) {
			sound.play('locked');
			return
		};
		sound.play('close');

		anim3.add(objects.info_cont,{alpha:[1,0,'linear']}, false, 0.25);

	}

}

lb={

	cards_pos: [[370,10],[380,70],[390,130],[380,190],[360,250],[330,310],[290,370]],
	last_update:0,

	show() {

		objects.bcg.texture=assets.lb_bcg;
		anim3.add(objects.bcg,{alpha:[0,1,'linear']}, true, 0.5);

		anim3.add(objects.lb_1_cont,{x:[-150, objects.lb_1_cont.sx,'easeOutBack']}, true, 0.5);
		anim3.add(objects.lb_2_cont,{x:[-150, objects.lb_2_cont.sx,'easeOutBack']}, true, 0.5);
		anim3.add(objects.lb_3_cont,{x:[-150, objects.lb_3_cont.sx,'easeOutBack']}, true, 0.5);
		anim3.add(objects.lb_cards_cont,{x:[450, 0,'easeOutCubic']}, true, 0.5);

		objects.lb_cards_cont.visible=true;

		anim3.add(objects.lb_back_btn,{y:[450, objects.lb_back_btn.sy,'linear']}, true, 0.25);

		for (let i=0;i<7;i++) {
			objects.lb_cards[i].x=this.cards_pos[i][0];
			objects.lb_cards[i].y=this.cards_pos[i][1];
			objects.lb_cards[i].place.text=(i+4)+".";

		}

		if (Date.now()-this.last_update>120000){
			this.update();
			this.last_update=Date.now();
		}


	},

	close() {

		//objects.bcg.texture=assets.bcg;
		objects.lb_1_cont.visible=false;
		objects.lb_2_cont.visible=false;
		objects.lb_3_cont.visible=false;
		objects.lb_cards_cont.visible=false;
		objects.lb_back_btn.visible=false;

	},

	back_btn_down() {

		if (anim3.any_on()===true) {
			sound.play('locked');
			return
		};


		sound.play('close_it');
		this.close();
		lobby.activate();

	},

	async update() {

		let leaders=await fbs.ref('players').orderByChild('rating').limitToLast(20).once('value');
		leaders=leaders.val();

		const top={
			0:{t_name:objects.lb_1_name,t_rating:objects.lb_1_rating,avatar:objects.lb_1_avatar},
			1:{t_name:objects.lb_2_name,t_rating:objects.lb_2_rating,avatar:objects.lb_2_avatar},
			2:{t_name:objects.lb_3_name,t_rating:objects.lb_3_rating,avatar:objects.lb_3_avatar},
		}

		for (let i=0;i<7;i++){
			top[i+3]={};
			top[i+3].t_name=objects.lb_cards[i].name;
			top[i+3].t_rating=objects.lb_cards[i].rating;
			top[i+3].avatar=objects.lb_cards[i].avatar;
		}

		//создаем сортированный массив лидеров
		const leaders_array=[];
		Object.keys(leaders).forEach(uid => {

			const leader_data=leaders[uid];
			const leader_params={uid,name:leader_data.name, rating:leader_data.rating, pic_url:leader_data.pic_url};
			leaders_array.push(leader_params);

			//добавляем в кэш
			players_cache.update(uid,leader_params);
		});

		//сортируем....
		leaders_array.sort(function(a,b) {return b.rating - a.rating});

		//заполняем имя и рейтинг
		for (let place in top){
			const target=top[place];
			const leader=leaders_array[place];
			target.t_name.set2(leader.name||'',place>2?190:130);
			target.t_rating.text=leader.rating;
		}

		//заполняем аватар
		for (let place in top){
			const target=top[place];
			const leader=leaders_array[place];
			await players_cache.update_avatar(leader.uid);
			target.avatar.texture=players_cache.players[leader.uid].texture;
		}

	}

}

players_cache={

	players:{},

	async my_texture_from(pic_url){

		//если это мультиаватар
		if(pic_url.includes('mavatar')) pic_url=multiavatar(pic_url);

		try{
			const texture = await PIXI.Texture.fromURL(pic_url);
			return texture;
		}catch(er){
			return PIXI.Texture.WHITE;
		}

	},

	async update(uid,params={}){

		//если игрока нет в кэше то создаем его
		if (!this.players[uid]) this.players[uid]={}

		//ссылка на игрока
		const player=this.players[uid];

		//заполняем параметры которые дали
		for (let param in params) player[param]=params[param];

		if (!player.name) player.name=await fbs_once('players/'+uid+'/name');
		if (!player.rating) player.rating=await fbs_once('players/'+uid+'/rating');

		//извлекаем страну если она есть в отдельную категорию и из имени убираем
		const country =auth2.get_country_from_name(player.name);
		if (country){
			player.country=country;
			player.name=player.name.slice(0, -4);
		}

	},

	async update_avatar(uid){

		const player=this.players[uid];
		if(!player) alert('Не загружены базовые параметры '+uid);

		//если текстура уже есть
		if (player.texture) return;

		//если нет URL
		if (!player.pic_url) player.pic_url=await fbs_once('players/'+uid+'/pic_url');

		if(player.pic_url==='https://vk.com/images/camera_100.png')
			player.pic_url='https://akukamil.github.io/domino/vk_icon.png';

		//загружаем и записываем текстуру
		if (player.pic_url) player.texture=await this.my_texture_from(player.pic_url);

	},

	async update_avatar_forced(uid, pic_url){

		const player=this.players[uid];
		if(!player) alert('Не загружены базовые параметры '+uid);

		if(pic_url==='https://vk.com/images/camera_100.png')
			pic_url='https://akukamil.github.io/domino/vk_icon.png';

		//сохраняем
		player.pic_url=pic_url;

		//загружаем и записываем текстуру
		if (player.pic_url) player.texture=await this.my_texture_from(player.pic_url);

	},

}

keep_alive = function() {

	fbs.ref('players/'+my_data.uid+'/tm').set(firebase.database.ServerValue.TIMESTAMP);
	fbs.ref(room_name+"/"+my_data.uid).onDisconnect().remove();

	set_state({});
}

function kill_game () {
	firebase.app().delete();
	document.body.innerHTML = 'CLIENT TURN OFF';
}

main_loader={

	preload_assets:0,

	spritesheet_to_tex(t,xframes,yframes,total_w,total_h,xoffset,yoffset){


		const frame_width=xframes?total_w/xframes:0;
		const frame_height=yframes?total_h/yframes:0;

		const textures=[];
		for (let y=0;y<yframes;y++){
			for (let x=0;x<xframes;x++){

				const rect = new PIXI.Rectangle(xoffset+x*frame_width, yoffset+y*frame_height, frame_width, frame_height);
				const quadTexture = new PIXI.Texture(t.baseTexture, rect);
				textures.push(quadTexture);
			}
		}
		return textures;
	},

	async load1(){


		const loader=new PIXI.Loader();

		//добавляем текстуры из листа загрузки
		loader.add('load_bar_bcg', git_src+'res/'+'common/load_bar_bcg.png');
		loader.add('load_bar_progress', git_src+'res/'+'common/load_bar_progress.png');
		loader.add('mfont2',git_src+'/fonts/core_sans_ds_32/font.fnt');
		loader.add('main_load_list',git_src+'/load_list.txt');

		//переносим все в ассеты
		await new Promise(res=>loader.load(res))
		for (const res_name in loader.resources){
			const res=loader.resources[res_name];
			assets[res_name]=res.texture||res.sound||res.data;
		}

		const load_bar_bcg=new PIXI.Sprite(assets.load_bar_bcg);
		load_bar_bcg.x=170;
		load_bar_bcg.y=170;
		load_bar_bcg.width=450;
		load_bar_bcg.height=70;

		this.load_bar_mask=new PIXI.Graphics();
		this.load_bar_mask.beginFill(0xff0000);
		this.load_bar_mask.drawRect(0,0,1,40);
		this.load_bar_mask.x=190;
		this.load_bar_mask.y=200;

		const load_bar_progress=new PIXI.Sprite(assets.load_bar_progress);
		load_bar_progress.x=170;
		load_bar_progress.y=200;
		load_bar_progress.width=450;
		load_bar_progress.height=40;
		load_bar_progress.mask=this.load_bar_mask

		this.t_progress=new PIXI.BitmapText('', {fontName: 'mfont32',fontSize: 18,align: 'center'});
		this.t_progress.y=225;
		this.t_progress.x=600;
		this.t_progress.tint=0xffffff;
		this.t_progress.anchor.set(1,0);

		this.t_info=new PIXI.BitmapText(['Загрузка...','Loading...'][LANG], {fontName: 'mfont32',fontSize: 20,align: 'center'});
		this.t_info.y=195;
		this.t_info.x=395;
		this.t_info.tint=0xffffff;
		this.t_info.anchor.set(0.5,0.5);

		objects.load_cont=new PIXI.Container();
		objects.load_cont.pivot.x=M_WIDTH*0.5
		objects.load_cont.pivot.y=M_HEIGHT*0.5
		objects.load_cont.x=M_WIDTH*0.5
		objects.load_cont.y=M_HEIGHT*0.5
		objects.load_cont.addChild(load_bar_bcg,load_bar_progress,this.load_bar_mask,this.t_info,this.t_progress)
		app.stage.addChild(objects.load_cont);

	},

	async load2(){

		//подпапка с ресурсами
		const lang_pack = ['RUS','ENG'][LANG];

		const bundle=[];

		const loader=new PIXI.Loader();

		//добавляем текстуры стикеров
		for (var i=0;i<12;i++)
			loader.add('sticker_texture_'+i, git_src+'stickers/'+i+'.png');

		//добавляем из основного листа загрузки
		const load_list=eval(assets.main_load_list);
		for (let i = 0; i < load_list.length; i++)
			if (load_list[i].class==='sprite' || load_list[i].class==='image')
				loader.add(load_list[i].name, git_src+'res/'+lang_pack + '/' + load_list[i].name + "." +  load_list[i].image_format);


		loader.add('mfont64',git_src+'/fonts/core_sans_ds_64/font.fnt');
		//loader.add('lobby_bcg',git_src+'res/common/lobby_bcg_img.jpg');
		//loader.add('main_bcg',git_src+'res/common/main_bcg_img.jpg');

		//добавляем библиотеку аватаров
		loader.add('multiavatar', 'https://akukamil.github.io/common/multiavatar.min.txt');

		loader.add('sell',git_src+'sounds/sell.mp3')
		loader.add('buy',git_src+'sounds/buy.mp3')
		loader.add('rent',git_src+'sounds/rent.mp3')
		loader.add('click',git_src+'sounds/click.mp3')
		loader.add('auc_bid',git_src+'sounds/auc_bid.mp3')
		loader.add('auc_change',git_src+'sounds/auc_change.mp3')
		loader.add('achivement',git_src+'sounds/achivement.mp3')
		loader.add('can_buy_any_city',git_src+'sounds/can_buy_any_city.mp3')
		loader.add('casino_m_300',git_src+'sounds/casino_m_300.mp3')
		loader.add('money',git_src+'sounds/money.mp3')
		loader.add('capture_city',git_src+'sounds/capture_city.mp3')
		loader.add('hotel_buy',git_src+'sounds/hotel_buy.mp3')
		loader.add('city_lost',git_src+'sounds/city_lost.mp3')
		loader.add('dice',git_src+'sounds/dice.mp3')
		loader.add('chip_go',git_src+'sounds/chip_go.mp3')
		loader.add('monopoly',git_src+'sounds/monopoly.mp3')
		loader.add('auc',git_src+'sounds/auc.mp3')
		loader.add('plans_popup',git_src+'sounds/plans_popup.mp3')
		loader.add('plans_click',git_src+'sounds/plans_click.mp3')
		loader.add('city_dlg',git_src+'sounds/city_dlg.mp3')
		loader.add('roll_btn',git_src+'sounds/roll_btn.mp3')
		loader.add('casino_roll',git_src+'sounds/casino_roll.mp3')
		loader.add('casino',git_src+'sounds/casino.mp3')
		loader.add('decline',git_src+'sounds/decline.mp3')
		loader.add('lost300',git_src+'sounds/lost300.mp3')
		loader.add('norent',git_src+'sounds/norent.mp3')
		loader.add('receive_sticker',git_src+'sounds/receive_sticker.mp3')
		loader.add('online_message',git_src+'sounds/online_message.mp3')
		loader.add('lose',git_src+'sounds/lose.mp3')
		loader.add('win',git_src+'sounds/win.mp3')
		loader.add('game_start',git_src+'sounds/game_start.mp3')

		//прогресс
		loader.onProgress.add((l,res)=>{
			this.load_bar_mask.width =410*l.progress*0.01;
			this.t_progress.text=Math.round(l.progress)+'%';
			});

		//ждем загрузки
		await new Promise(res=>loader.load(res))


		//переносим все в ассеты
		await new Promise(res=>loader.load(res))
		for (const res_name in loader.resources){
			const res=loader.resources[res_name];
			assets[res_name]=res.texture||res.sound||res.data;
		}


		//добавялем библиотеку аватаров
		const script = document.createElement('script');
		script.textContent = assets.multiavatar;
		document.head.appendChild(script);

		await anim3.add(objects.load_cont,{alpha:[1,0,'linear'],scale_xy:[1,3,'linear'],angle:[0,-30,'linear']}, false, 0.25);



		objects.bcg=new PIXI.Sprite();
		objects.bcg.x=-10;
		objects.bcg.y=-10;
		objects.bcg.width=M_WIDTH+20;
		objects.bcg.height=M_HEIGHT+20;
		app.stage.addChild(objects.bcg);


		//создаем спрайты и массивы спрайтов и запускаем первую часть кода
		const main_load_list=eval(assets.main_load_list);
		for (var i = 0; i < main_load_list.length; i++) {
			const obj_class = main_load_list[i].class;
			const obj_name = main_load_list[i].name;
			console.log('Processing: ' + obj_name)

			switch (obj_class) {
			case "sprite":
				objects[obj_name] = new PIXI.Sprite(assets[obj_name]);
				eval(main_load_list[i].code0);
				break;

			case "block":
				if (obj_name==='cells')
					console.log(main_load_list[i].code)
				eval(main_load_list[i].code0);
				break;

			case "cont":
				eval(main_load_list[i].code0);
				break;

			case "array":
				var a_size=main_load_list[i].size;
				objects[obj_name]=[];
				for (var n=0;n<a_size;n++)
					eval(main_load_list[i].code0);
				break;
			}
		}

		//обрабатываем вторую часть кода в объектах
		for (var i = 0; i < main_load_list.length; i++) {
			const obj_class = main_load_list[i].class;
			const obj_name = main_load_list[i].name;
			console.log('Processing: ' + obj_name)


			switch (obj_class) {
			case "sprite":
				eval(main_load_list[i].code1);
				break;

			case "block":
				eval(main_load_list[i].code1);
				break;

			case "cont":
				eval(main_load_list[i].code1);
				break;

			case "array":
				var a_size=main_load_list[i].size;
					for (var n=0;n<a_size;n++)
						eval(main_load_list[i].code1);	;
				break;
			}
		}


	}

}

language_dialog = {

	p_resolve : {},
	show () {
		return new Promise(function(resolve, reject){
			document.body.innerHTML='<style>html,body {margin: 0;padding: 0;height: 100%;}body {display: flex;align-items: center;justify-content: center;background-color: rgba(24,24,44,1);flex-direction: column}.two_buttons_area {  width: 70%;  height: 50%;  margin: 20px 20px 0px 20px;  display: flex;  flex-direction: row;}.button {margin: 5px 5px 5px 5px;width: 50%;height: 100%;color:white;display: block;background-color: rgba(44,55,60,1);font-size: 10vw;padding: 0px;}  #m_progress {  background: rgba(11,255,255,0.1);  justify-content: flex-start;  border-radius: 100px;  align-items: center;  position: relative;  padding: 0 5px;  display: none;  height: 50px;  width: 70%;}#m_bar {  box-shadow: 0 10px 40px -10px #fff;  border-radius: 100px;  background: #fff;  height: 70%;  width: 0%;}</style><div id ="two_buttons" class="two_buttons_area"><button class="button" id ="but_ref1" onclick="language_dialog.p_resolve(0)">RUS</button><button class="button" id ="but_ref2"  onclick="language_dialog.p_resolve(1)">ENG</button></div><div id="m_progress">  <div id="m_bar"></div></div>';
			language_dialog.p_resolve = resolve;
		})
	}

}

tabvis={

	inactive_timer:0,
	sleep:0,
	invis_timer:0,

	change(){

		if (document.hidden){

			PIXI.sound.volumeAll=0;
			this.inactive_timer=setTimeout(()=>{this.send_to_sleep()},120000);
			this.invis_timer=setInterval(()=>{
				tabvis.process();
			},16);

		}else{
			clearInterval(this.invis_timer);
			PIXI.sound.volumeAll=1;
			if(this.sleep){
				console.log('Проснулись')
				my_ws.reconnect('wakeup')
				this.sleep=0;
			}
			clearTimeout(this.inactive_timer);
		}

		set_state({hidden : document.hidden});

	},

	send_to_sleep(){

		console.log('погрузились в сон')
		this.sleep=1;
		if (lobby.on){
			lobby.close()
			main_menu.activate();
		}
		my_ws.send_to_sleep();
	},

	start_hid_process(){

		this.invis_timer=setInterval(()=>{
			tabvis.process();
		},16);

	},

	process(){

		//if (!common.move_on) return;
		for (let key in some_process)
			some_process[key]();
		anim3.process();

	}
}

async function define_platform_and_language() {

	const s = window.location.href;

	if (s.includes('yandex')) {
		game_platform = 'YANDEX';
		if (s.match(/yandex\.ru|yandex\.by|yandex\.kg|yandex\.kz|yandex\.tj|yandex\.ua|yandex\.uz/))
			LANG = 0;
		else
			LANG = 1;
		return;
	}

	if (s.includes('vk.com')||s.includes('vk_app_id')) {
		game_platform = 'VK';
		LANG = 0;
		return;
	}

	if (s.includes('google_play')) {

		game_platform = 'GOOGLE_PLAY';
		LANG = await language_dialog.show();
		return;
	}

	if (s.includes('my_games')) {

		game_platform = 'MY_GAMES';
		LANG = 0;
		return;
	}

	if (s.includes('crazygames')) {

		game_platform = 'CRAZYGAMES';
		LANG = 1;
		return;
	}

	if (s.includes('127.0')) {

		game_platform = 'DEBUG';
		LANG = await language_dialog.show();
		return;
	}

	game_platform = 'UNKNOWN';
	LANG = 0//await language_dialog.show();


}

async function init_game_env(lang) {


	await define_platform_and_language();

	//идентификация
	await auth2.init();

	//инициируем файербейс
	if (!firebase.apps.length) {
		firebase.initializeApp({
			apiKey: "AIzaSyCXmV64Bydyie1QsViyBPprtfSe1qpljt4",
			authDomain: "monopoly-b6de9.firebaseapp.com",
			databaseURL: "https://monopoly-b6de9-default-rtdb.europe-west1.firebasedatabase.app",
			projectId: "monopoly-b6de9",
			storageBucket: "monopoly-b6de9.firebasestorage.app",
			messagingSenderId: "226062460929",
			appId: "1:226062460929:web:0afbd5f23cd9a76ee7f800"
		});

		//коротко файрбейс
		fbs=firebase.database();
	}

	//создаем приложение пикси
	document.body.innerHTML='<style>html,body {margin: 0;padding: 0;height: 100%;}body {display: flex;align-items:center;justify-content: center;background-color: rgba(1,168,246,1)}</style>';
	app = new PIXI.Application({width:M_WIDTH, height:M_HEIGHT,antialias:false,backgroundColor : 0x01A8F6});
	const c=document.body.appendChild(app.view);
	c.style['boxShadow'] = '0 0 15px #000000';

	//доп функция для текста битмап
	PIXI.BitmapText.prototype.set2=function(text,w){
		const t=this.text=text;
		for (i=t.length;i>=0;i--){
			this.text=t.substring(0,i)
			if (this.width<w) return;
		}
	}

	//доп функция для применения текстуры к графу
	PIXI.Graphics.prototype.set_texture=function(texture){

		if(!texture) return;
		// Get the texture's original dimensions
		const textureWidth = texture.baseTexture.width;
		const textureHeight = texture.baseTexture.height;

		// Calculate the scale to fit the texture to the circle's size
		const scaleX = this.w / textureWidth;
		const scaleY = this.h / textureHeight;

		// Create a new matrix for the texture
		const matrix = new PIXI.Matrix();

		// Scale and translate the matrix to fit the circle
		matrix.scale(scaleX, scaleY);
		const radius=this.w*0.5;
		this.clear();
		this.beginTextureFill({texture,matrix});
		this.drawCircle(radius, radius, radius);
		this.endFill();
	}

	//события изменения окна
	resize();
	window.addEventListener('resize', resize);


	//запускаем главный цикл
	main_loop();


	await main_loader.load1();
	await main_loader.load2();

	anim3.add(objects.id_cont,{alpha:[0,1,'linear'],y:[-200,objects.id_cont.sy,'easeOutBack']}, true,0.5);
	some_process.loup_anim=()=>{objects.id_gear.rotation+=0.02}

	//загрузка сокета
	await auth2.load_script('https://akukamil.github.io/common/my_ws.js');

	//загружаем остальные данные из файербейса
	const other_data = await fbs_once('players/' + my_data.uid)
	if(!other_data) lobby.first_run=1;

	//сервисное сообщение
	if(other_data && other_data.s_msg){
		message.add(other_data.s_msg);
		fbs.ref('players/'+my_data.uid+'/s_msg').remove();
	}

	my_data.rating = (other_data?.rating) || 1400;
	my_data.games = (other_data?.games) || 0;
	my_data.name = (other_data?.name)||my_data.name;
	my_data.country = other_data?.country || await auth2.get_country_code() || await auth2.get_country_code2();
	my_data.nick_tm = other_data?.nick_tm || 0;
	my_data.avatar_tm = other_data?.avatar_tm || 0;

	//правильно определяем аватарку
	if (other_data?.pic_url && other_data.pic_url.includes('mavatar'))
		my_data.pic_url=other_data.pic_url
	else
		my_data.pic_url=my_data.orig_pic_url

	//добавляем страну к имени если ее нет
	if (!auth2.get_country_from_name(my_data.name)&&my_data.country)
		my_data.name=`${my_data.name} (${my_data.country})`

	//загружаем мои данные в кэш
	await players_cache.update(my_data.uid,{pic_url:my_data.pic_url,country:my_data.country,name:my_data.name,rating:my_data.rating});
	await players_cache.update_avatar(my_data.uid)

	//устанавливаем данные в попап
	objects.id_avatar.set_texture(players_cache.players[my_data.uid].texture);
	objects.id_name.set2(my_data.name,150);
	objects.id_rating.text=my_data.rating;
	anim3.add(objects.id_name,{alpha:[0,1,'linear']}, true, 0.55);
	anim3.add(objects.id_rating,{alpha:[0,1,'linear']}, true, 0.55);

	//обновляем почтовый ящик
	fbs.ref('inbox/'+my_data.uid).remove()

	//подписываемся на новые сообщения
	fbs.ref('inbox/'+my_data.uid).on('child_added', data=>{process_new_message(data.val())});

	//обновляем данные в файербейс так как могли поменяться имя или фото
	fbs.ref('players/'+my_data.uid).set({
		name:my_data.name,
		pic_url:my_data.pic_url,
		rating:my_data.rating,
		nick_tm:my_data.nick_tm,
		avatar_tm:my_data.avatar_tm,
		games:my_data.games,
		country:my_data.country||'',
		tm:firebase.database.ServerValue.TIMESTAMP,
		session_start:firebase.database.ServerValue.TIMESTAMP
	})

	//первый вход и начальные бонусы
	if(!other_data?.first_log_tm){
		fbs.ref('players/'+my_data.uid+'/first_log_tm').set(firebase.database.ServerValue.TIMESTAMP);
	}


	//номер комнаты
	room_name= 'states1';

	//ждем загрузки чата
	await Promise.race([
		chat.init(),
		new Promise(resolve=> setTimeout(() => {console.log('chat is not loaded!');resolve()}, 2000))
	]);

	//включаем музыку
	//pref.init_music();

	//идентификатор клиента
	client_id = irnd(10,999999);
	
	SERVER_TM=await my_ws.get_tms() 

	//устанавливаем мой статус в онлайн
	set_state({state:'o'});

	//сообщение для дубликатов
	fbs.ref('inbox/'+my_data.uid).push({m:'CLIEND_ID',tm:Date.now(),client_id});

	//отключение от игры и удаление не нужного
	fbs.ref(room_name+'/'+my_data.uid).onDisconnect().remove();

	//keep-alive сервис
	setInterval(function()	{keep_alive()}, 40000);

	//убираем попап
	some_process.loup_anim = function(){};
	setTimeout(function(){anim3.add(objects.id_cont,{y:[objects.id_cont.sy, -300,'linear'],x:[objects.id_cont.sx,1200,'linear'],angle:[0,200,'linear']}, false, 0.4)},500);

	//это разные события
	//document.addEventListener("visibilitychange", function(){tabvis.change()});
	window.addEventListener('wheel', (event) => {
		//lobby.wheel_event(Math.sign(event.deltaY));
		chat.wheel_event(Math.sign(event.deltaY));
	});
	window.addEventListener('keydown', function(event) { keyboard.keydown(event.key)});
	//window.addEventListener('contextmenu', event => event.preventDefault());

	main_menu.activate();

	//покупки яндекса
	//pref.consume_yndx_purchases();
}

function main_loop() {

	//обрабатываем минипроцессы
	for (let key in some_process)
		some_process[key]();

	game_tick+=0.016666666;
	anim3.process();
	requestAnimationFrame(main_loop);
}




