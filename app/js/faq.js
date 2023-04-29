class Faq {
	constructor() {
	}

	init() {
		const accordionBtns = document.querySelectorAll('.accordionBtn');
		this.activeIndex = null; 											//開いているアコーディオンのindex取得用

		accordionBtns.forEach( (accordionBtn, index) => {
			accordionBtn.addEventListener('click', () => {
		
				this.activeIndex = index; 									//クリックされた要素を開いているindexに退避			
				accordionBtn.classList.toggle('active'); 					//ボタンにクラスを付与／削除
				const content = accordionBtn.nextElementSibling; 			//次の要素を取得

				if(accordionBtn.classList.contains('active')){
					console.log('開く');
					this.slideDown(content); 								//クラス名がactive（＝閉じていた）なら開く関数を実行
				}else{
					console.log('閉じる');
					this.slideUp(content); 									//クラス名にactiveがない（＝開いていた）なら閉じる関数を実行
				}

				//現在開いているメニュー以外を閉じる
				accordionBtns.forEach( (accordionBtn, index) => {
					if (this.activeIndex !== index) {
						accordionBtn.classList.remove('active');
						const openedContent = accordionBtn.nextElementSibling;
						this.slideUp(openedContent); 						
					}
				});
			});
		});
	}

	// メニューを開く関数
	slideDown(el) {
		el.style.height = 'auto';		//いったんautoに
		let h = el.offsetHeight;		//autoにした要素から高さを取得
		el.style.height = h + 'px';

		el.animate({					//高さ0から取得した高さまでのアニメーション
			height: [ 0, h + 'px' ]
		}, {
			duration: 300, 				//アニメーションの時間（ms）
		});
		el.style.height = 'auto'; 		//ブラウザの表示幅を途中で閲覧者が変えた時を考慮してautoに戻す
	};

	// メニューを閉じる関数
	slideUp(el) {
		let h = el.offsetHeight;
		el.style.height = h + 'px';

		el.animate({
			height: [ h + 'px', 0 ]
		}, {
			duration: 300,
		});
		el.style.height = 0;
	};
}

window.addEventListener('load', () => {
	new Faq().init();
})