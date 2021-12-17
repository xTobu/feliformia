export default function ({ $axios, redirect }) {
  $axios.onRequest((config) => {
    config.headers["Accept"] = "application/json";
    config.headers["Content-Type"] = "application/json; charset=utf-8";
  });

  // $axios.onResponse((response) => {
  // });

  // $axios.onError(error => {
  // 	const code = parseInt(error.response && error.response.status);
  // 	if (code === 400) {
  // 		redirect('/400');
  // 	}
  // });
}
