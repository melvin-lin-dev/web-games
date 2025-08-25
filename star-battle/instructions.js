$(function () {
  let items = $('#instructions *');

  for (let i = 0; i < items.length; i++) {
    setTimeout( function () {
      // $(items[i]).addClass('animate');
    }, i * 25)
  }
});