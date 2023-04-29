// カルーセル
class Carousel {
	// 初期化
	constructor(query) {
		this.$elm = document.querySelector(query);
		this.maxIndex = Math.round(this.$elm.scrollWidth / this.$elm.clientWidth);
	}

	init(){
		// ボタンのセットアップ
		const $btnPrev = document.querySelector('.btn-prev');
		const $btnNext = document.querySelector('.btn-next');

		$btnPrev.onclick = (event) => {
			event.preventDefault();
			this.prev(); 
		};
		$btnNext.onclick = (event) => {
			event.preventDefault();
			this.next(); 
		};
	}

	// 今の index を取得
	get index() {
		const index = Math.round(this.$elm.scrollLeft / this.$elm.clientWidth);
		return index;
	}

	// 指定した場所に移動
	goto(index) {
		const i = (index + this.maxIndex) % this.maxIndex;
		this.$elm.children[i].scrollIntoView({ 
			behavior: "smooth" , 
			block: "center"
		});
	}

	// 次へ
	next() {
		this.goto(this.index+1);
	}

	// 前へ
	prev() {
		this.goto(this.index-1);
	}
}

window.addEventListener('load', () => {
	new Carousel('.carousel').init();
});
