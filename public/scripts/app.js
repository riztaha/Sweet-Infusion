<<<<<<< HEAD

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

=======
// $(() => {
//   $.ajax({
//     method: "GET",
//     url: "/api/users",
//   }).done((users) => {
//     for (user of users) {
//       $("<div>").text(user.name).appendTo($("body"));
//     }
//   });
// });

//API for Menu Items
// $(() => {
//   $.ajax({
//     method: "GET",
//     url: "/api/menu",
//   });
// .done((menu) => {
//   for (let item of menu) {
//     $("<div>").text(item).appendTo($("body"));
//   }
// });
// });
>>>>>>> 6386876b18d6aa9a1ae402c5e097d20adf5b9fa8
