<template>
    <b-container class="animate__animated animate__fadeInRight mt-12 text-center">
        <h1>Etape 2</h1>
        <b-card bg-variant="dark" text-variant="white" header="Tableau des activités" header-tag="header">
        <b-table :fields="fields" :items="items" responsive striped hover caption-top dark bordered>
            <template v-slot:table-caption>
                Renseigner les activités.
            </template>

            <template v-slot:cell(timing)="row">

                <span v-if="readyToGo" class="badge badge-warning">
                  {{ formatTiming(tasks[row.index].timing) }}
                </span>

                <b-input type="number" :name="'input_' + row.index" placeholder="Durée"
                required
                v-model="inputs[row.index]"
                v-if="!readyToGo"
                :class="isValid(row.index)"
                @change="validInputs()">
                </b-input>

                <div class="invalid-feedback" v-if="!valid[row.index]">
                    La durée ne peut pas être nulle ou négative
                </div>
            </template>
            
        </b-table>

        <b-button variant="info" v-if="readyToRegister && !readyToGo" @click="update()" class="mt-4">Enregistrer</b-button>
        <b-button variant="info" v-if="readyToGo" @click="next()" class="mt-4">Poursuivre</b-button>

        </b-card>
    </b-container>
</template>

<script>
export default {
  name: 'tasksTable',

  data () {
    return {
      cardinal: 0,
      tasks: null,
      inputs: null,
      valid: null,
      readyToRegister: false,
      readyToGo: false,
    }
  },

  computed: {
    items () {
      let items_ = [];
      for(let i = 0; i < this.cardinal; i++) {
          items_[i] = {task: this.tasks[i].name, timing: this.tasks[i].timing, dependancies: this.tasks[i].dependancies};
      }

      return items_;
    },
    fields () {
      return [
          {
            key: 'task',
            label: 'Tâches',
          },
          {
            key: 'timing',
            label: 'Durée',
          }
      ]
    },
  },

  methods: {
      formatTiming: function (number) {
          return number == null ? '' : number;
      },
      isValid: function (index) {
          this.valid[index] = this.inputs[index] > 0 && this.inputs[index] != null;

          return this.valid[index]? '' : 'is-invalid';
      },
      validInputs: function () {
        let i = 0;
        while(this.valid[i] && i++ < this.valid.length);
        this.readyToRegister = i == this.valid.length;
      },
      update: function () {
          let i = 0;
          this.tasks.forEach(task => {
              task.timing = this.inputs[i++];
          });
          this.readyToGo = true;
      },
      next: function () {
        this.$store.commit('setData', this.tasks);
        this.$router.push({name: 'dependancies'})
      }
  },
  
  created () {
    this.cardinal = this.$store.getters.cardinal;
    let tasks_ = [];
    for(let i = 1; i <= this.cardinal; i++) {
        tasks_[i-1] = { name: 'T' + i, timing: null, dependancies: []};
    }
    this.tasks = tasks_;
    this.inputs = [];
    this.valid = [];
  }
}
</script>