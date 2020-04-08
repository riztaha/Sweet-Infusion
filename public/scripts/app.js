
// // // document ready
// $(() => {

// });

// // onclick listenner with classname add, use this.

// //need items id, name and price
// //




// const renderTweets = function(tweets) {
//   $("#tweets-container").empty();
//   for (let tweet of tweets) {
//     $("#tweets-container").prepend(createTweetElement(tweet));
//   }
// };

// const createTweetElement = function(tweet) {
//   const fullDate = new Date(tweet.created_at);
//   const date = (fullDate.getUTCMonth() + 1) + "/" + fullDate.getUTCMonth() + "/" + fullDate.getFullYear();
//   return `<article class= "tweet">
//   <div class="tweet-feed">
//     <div class="header1 header">
//       <img class="h1 avatars" src = ${tweet.user.avatars}>
//       <h3 class="h1 name">${tweet.user.name}</h3>
//     </div>
//     <h3 class="header handle">${tweet.user.handle}</h3>
//   </div>
//   <p class="feed">${escape(tweet.content.text)}</p> <hr>
//   <div class="footer">
//     <span class="date">Created on: ${date}</span>
//     <span class = "icons">&#128681; &#128257 &#128147</span>
//   </div>
// </article>`;
// };

// return <li class="menu_container quantity" >
// <img class="image_home image_menu" src="<%=menu_items[0].photo%>" alt="">
// <div class='dish-card'>
//   <h5><%=menu_items[0].name%></h5>
//   <p><%=menu_items[0].description%></p>
//   <div id="<%=menu_items[0].id%>">
//     <span class="price">$<%=(menu_items[0].price/100).toFixed(2)%></span>
//     <input type='button' name='subtract' onclick='javascript: subtractQty();' value='-'/>
//     <input type='text' name='qty' value="0" />
//     <input type='button' name='add' onclick='javascript: document.getElementsByName("qty").value++;' value='+'/>
//     <!-- add button 'add to cart' with class name -->
//   </div>
// </div>
// </li>
