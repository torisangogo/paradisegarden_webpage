// ページトップへボタン
const pageTop = document.querySelector(".goto_top_button");

pageTop.addEventListener("click", () => {
	window.scroll({ top: 0, behavior: "smooth" });
});

let set_position = 0;
window.addEventListener('scroll',() => {
	if(window.pageYOffset < 400) {
		pageTop.classList.remove('visible');
		pageTop.classList.remove('fadein');
		pageTop.classList.remove('fadeout');

		pageTop.classList.add('hidden');

	// カレンダーに植木鉢が重ならないようにする
	} else if(window.pageYOffset >= 400 && window.pageYOffset < 640) {
		if (set_position < document.documentElement.scrollTop) {
			// スクロールダウンの時、ふんわり現れる
			pageTop.classList.remove('visible');
			pageTop.classList.remove('fadeout');
			pageTop.classList.remove('hidden');	

			pageTop.classList.add('fadein');
		} else {
			// スクロールアップの時、ふんわり消える
			pageTop.classList.remove('visible');	
			pageTop.classList.remove('fadein');
			pageTop.classList.remove('hidden');	
			
			pageTop.classList.add('fadeout');
		}
	} else {
		pageTop.classList.remove('fadein');
		pageTop.classList.remove('fadeout');
		pageTop.classList.remove('hidden');	

		pageTop.classList.add('visible');
	}

	set_position = document.documentElement.scrollTop;
});