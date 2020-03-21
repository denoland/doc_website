import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js';

var app = new Vue({
el: '#doc',
data: {
    docs: null
},
created: async function () {
    console.log("loading json data");
    const res = await fetch("./docs.json");
    this.docs = await res.json();
    console.log(this.docs);
  }
});