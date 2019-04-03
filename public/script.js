var app = new Vue({
  el: '#app',
  data: {
      pets: [],
      showForm: false,
  },
  created() {
    this.getPets();
  },
  methods: {
    async getPets() {
      try {
        let response = await axios.get("/api/pets");
        this.pets = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    toggleForm() {
      this.showForm = !this.showForm;
    },
  }
});
