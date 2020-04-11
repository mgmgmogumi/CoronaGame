enchant();

window.onload = function () {
	var game = new Game(400, 500);  				//画面サイズを400*500にする。（このサイズだとスマホでも快適なのでおススメ）

	//結果ツイート時にURLを貼るため、このゲームのURLをここに記入
	var url = "https://mgmgmgmi.github.io/CoronaGame/";
	url = encodeURI(url); //きちんとURLがツイート画面に反映されるようにエンコードする
	/////////////////////////////////////////////////
	//ゲーム開始前に必要な画像・音を読み込む部分


	//クリック音読み込み
	var ClickSound = "click.wav";						//game.htmlからの相対パス
	game.preload([ClickSound]); 				//データを読み込んでおく

	//コロナウイルス画像
	var CoronaImg = "virus_corona.png";						//game.htmlからの相対パス
	game.preload([CoronaImg]);					//データを読み込んでおく

	//リトライボタン
	var B_Retry = "Retry.png";						//game.htmlからの相対パス
	game.preload([B_Retry]);					//データを読み込んでおく

	//ツイートボタン
	var B_Tweet = "Tweet.png";						//game.htmlからの相対パス
	game.preload([B_Tweet]);					//データを読み込んでおく		

	//読み込み終わり
	/////////////////////////////////////////////////


	game.onload = function () {					//ロードが終わった後にこの関数が呼び出されるので、この関数内にゲームのプログラムを書こう

		/////////////////////////////////////////////////
		//グローバル変数 

		var Point = 0;									//ポイント
		var State = 0;								//現在のゲーム状態

		//グローバル変数終わり
		/////////////////////////////////////////////////

		var S_MAIN = new Scene();					//シーン作成
		game.pushScene(S_MAIN);  					//S_MAINシーンオブジェクトを画面に設置
		S_MAIN.backgroundColor = "black"; 			//S_MAINシーンの背景は黒くした

		//ポイント表示テキスト
		var S_Text = new Label(); 					//テキストはLabelクラス
		S_Text.font = "20px Meiryo";				//フォントはメイリオ 20px 変えたかったらググってくれ
		S_Text.color = 'rgba(255,255,255,1)';		//色　RGB+透明度　今回は白
		S_Text.width = 400;							//横幅指定　今回画面サイズ400pxなので、width:400pxだと折り返して二行目表示してくれる
		S_Text.moveTo(0, 30);						//移動位置指定
		S_MAIN.addChild(S_Text);					//S_MAINシーンにこの画像を埋め込む

		//コロナボタン
		var Corona = new Sprite(229, 230);				//画像サイズをここに書く。使う予定の画像サイズはプロパティで見ておくこと
		Corona.moveTo(118, 100);						//コロナボタンの位置
		Corona.image = game.assets[CoronaImg];			//読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
		S_MAIN.addChild(Corona);					//S_MAINにこのコロナ画像を貼り付ける  

		Corona.ontouchend = function () {				//コロナボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			Point++;									//Pointを1増やす
			game.assets[ClickSound].clone().play();		//クリックの音を鳴らす。

			//クリックしたのでコロナ画像のｘ位置を戻す
			this.x = -200;							//this.xって何？と思った方、Coronaの関数内でコロナの座標を動かすときにはthisを使います。

			//ポイントによって状態Stateを変更する
			if (Point < 3) {
				State = 1;
			} else if (Point < 6) {
				State = 2;
			} else if (Point < 9) {
				State = 3;
			} else if (Point < 12) {
				State = 4;
			} else {
				State = 5;
			}

		};


		///////////////////////////////////////////////////
		//メインループ　ここに主要な処理をまとめて書こう
		game.onenterframe = function () {
			if (State == 0) { 							//State=0のとき、初期セット状態(Pointの状態を０にして)
				Corona.x = -200;						//コロナのｘ座標を指定
				Corona.y = 100;						//コロナのy座標を指定
				Point = 0;  							//point初期化
				State = 1;							//ゲームスタート状態に移行
			}
			if (State == 1) {							//ゲームスタート　状態１
				Corona.x += 5;
			}
			if (State == 2) {							//状態２（Point３以上なら）
				Corona.x += 15;
			}
			if (State == 3) {							//状態３（Point６以上から）
				Corona.x += 10;
				Corona.y = 200 + Math.sin(Corona.x / 70) * 100; // ｙ座標を振幅100pxのサイン波で移動(Sinは便利なので慣れとくといいよ！)
			}
			if (State == 4) {							//状態４（Point９以上から）　4は初期セット状態（State=4）と移動状態（State=4.1)の2つに状態をわける		
				Corona.y = Math.random() * 400;			//ｙ座標の位置をランダムに決定
				State = 4.1;
			}
			if (State == 4.1) {							//状態４．１ 移動状態
				Corona.x += 10;						//ただ移動します
			}
			if (State == 5) {							//状態５（Point１２以上から）　 ｙ軸が毎フレーム毎に変化する
				Corona.x += 20;						//移動します。
				Corona.y = Math.random() * 400;			//ｙ座標の位置を枚フレーム毎にランダム決定
			}

			//現在のテキスト表示
			S_Text.text = "コロナを" + Point + "匹やっつけた"; 				//Point変数が変化するので、毎フレームごとにPointの値を読み込んだ文章を表示する

			//ゲームオーバー判定
			if (Corona.x >= 400) {						//画面端にコロナ画像が行ってしまったら
				game.popScene();					//S_MAINシーンを外す
				game.pushScene(S_END);				//S_ENDシーンを読み込ませる

				//ゲームオーバー後のテキスト表示
				S_GameOverText.text = "GAMEOVER コロナを" + Point + "匹やっつけた！";				//テキストに文字表示 
			}

		};

		////////////////////////////////////////////////////////////////
		//結果画面
		S_END = new Scene();
		S_END.backgroundColor = "black";

		//GAMEOVER
		var S_GameOverText = new Label(); 					//テキストはLabelクラス
		S_GameOverText.font = "20px Meiryo";				//フォントはメイリオ 20px 変えたかったらググってくれ
		S_GameOverText.color = 'rgba(255,255,255,1)';		//色　RGB+透明度　今回は白
		S_GameOverText.width = 400;							//横幅指定　今回画面サイズ400pxなので、width:400pxだと折り返して二行目表示してくれる
		S_GameOverText.moveTo(0, 30);						//移動位置指定
		S_END.addChild(S_GameOverText);						//S_ENDシーンにこの画像を埋め込む



		//リトライボタン
		var S_Retry = new Sprite(120, 60);				//画像サイズをここに書く。使う予定の画像サイズはプロパティで見ておくこと
		S_Retry.moveTo(50, 300);						//リトライボタンの位置
		S_Retry.image = game.assets[B_Retry];			//読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
		S_END.addChild(S_Retry);					//S_ENDにこのリトライボタン画像を貼り付ける  

		S_Retry.ontouchend = function () {				//S_Retryボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			State = 0;
			game.popScene();						//S_ENDシーンを外す
			game.pushScene(S_MAIN);					//S_MAINシーンを入れる
		};

		//ツイートボタン
		var S_Tweet = new Sprite(120, 60);				//画像サイズをここに書く。使う予定の画像サイズはプロパティで見ておくこと
		S_Tweet.moveTo(230, 300);						//リトライボタンの位置
		S_Tweet.image = game.assets[B_Tweet];			//読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
		S_END.addChild(S_Tweet);					//S_ENDにこのリトライボタン画像を貼り付ける  

		S_Tweet.ontouchend = function () {				//S_Tweetボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			//ツイートＡＰＩに送信

			window.open(
				"http://twitter.com/intent/tweet?"
				+ "text=コロナウイルス" + Point + "匹やっつけた！"
				+ "&hashtags=コロナをやっつけろ"
				+ "&via=mgmgmogumi"
				+ "&url=" + url
			);
		};

	};
	game.start();
};