var app = new Vue({
  el: '#admin',
  data: {
    name: "",
    file: null,
    addPet: null,
    pets: [],
    findName: "",
    findPet: null,
    description: "",
    age: "",
  },
  created() {
    this.getPets();
  },
  computed: {
    suggestions() {
      return this.pets.filter(pet => pet.name.toLowerCase().startsWith(this.findName.toLowerCase()));
    }
  },
  methods: {
    fileChanged(event) {
      this.file = event.target.files[0]
    },
    async upload() {
      try {
        const formData = new FormData();
        formData.append('photo', this.file, this.file.name)
        let r1 = await axios.post('/api/photos', formData);
        let r2 = await axios.post('/api/pets', {
          name: this.name,
          path: r1.data.path,
          description: this.description,
          age: this.age
        });
        this.addPet = r2.data;
      } catch (error) {
        console.log(error);
      }
    },
    async getPets() {
      try {
        let response = await axios.get("/api/pets");
        this.pets = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    selectPet(pet) {
      this.findName = "";
      this.findPet = pet;
    },
    async deletePet(pet) {
      try {
        let response = axios.delete("/api/pets/" + pet._id);
        this.findPet = null;
        this.getPets();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async editPet(pet) {
      try {
        let response = await axios.put("/api/pets/" + pet._id, {
          name: this.findPet.name,
          description:this.findPet.description,
          age: this.findPet.age,
        });
        this.findPet = null;
        this.getPets();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
  }
});
