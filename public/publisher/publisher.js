let publishForm = document.getElementById('publishForm');

publishForm.addEventListener('submit', function (e) {
  e.preventDefault();
  let topic = document.getElementById('topic').value;
  let message = document.getElementById('message').value;

  fetch('/mqtt', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({
      topic: topic,
      message: message,
    }),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    })
    .catch((error) => console.error('Error:', error));
});
