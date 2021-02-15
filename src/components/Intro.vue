<template>
  <b-container class="animate__animated animate__fadeInLeft text-center mt-12">
    <h1>Etape 1</h1>
    <b-card bg-variant="dark" text-variant="white" header="Combien d'activités à ordonnancer ?" header-tag="header">
      <label for="cardinal">Nombre de tâches</label>
      <b-input type="number" name="cardinal" placeholder="Entrer le nombre d'activités"
      v-model="input" 
      @change="checkCardinalChange"
      :class="isValid()" 
      required>
      </b-input>
      <div class="invalid-feedback" v-if="!valid">
        Il doit y avoir au moins deux activités pour commencer un ordonnancement
      </div>
      <b-button variant="info" v-if="valid" class="mt-8" @click="next">Poursuivre</b-button>
    </b-card>
  </b-container>
</template>

<script>
export default {
  name: 'intro',
  data () {
    return {
      input: null,
      valid: false,
    }
  },
  methods: {
    checkCardinalChange: function () {
      this.valid = this.input >= 2;
    },
    isValid: function () {
      if(!this.valid) {
        return "is-invalid";
      }
    },
    next: function () {
      this.$store.commit('setCardinal', this.input);
      this.$router.push({name: 'tasks'});
    }
  }   
}
</script>
