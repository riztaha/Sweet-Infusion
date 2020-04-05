
//API for Menu Items
$(() => {
  $.ajax({
    method: "GET",
    url: "/api/menu",
  }).done((menu) => {
    for (item of menu) {
      $("<div>").text(item).appendTo($("body"));
    }
  });
});

