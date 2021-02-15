<template>
    <b-container class="animate__animated animate__fadeInRight mt-12 text-center">
        <h1>Etape 3</h1>
        <b-card text-variant="white" bg-variant="dark" header="Tableau des dépendances" header-tag="header">
          <b-table :fields="fields"  :items="items" responsive hover caption-top dark bordered>

              <template v-slot:cell(task)="data">
                  {{ tasks[data.index].name }}
              </template>

              <template v-slot:cell()="data">
                <b-checkbox v-model="data.item[data.field.key]"
                @input="check()"
                v-if="data.field.key != tasks[data.index].name
                && checkNonReflectivity(data.index, data.field.key)"></b-checkbox>
              </template>

              <template v-slot:table-caption>
                  Configurer les dépendances.
              </template>
          </b-table>
        <b-button variant="info" v-if="!invalid" class="mt-4" @click="next()">Poursuivre</b-button>
        <div class="mt-8 alert alert-danger alert-dismissible fade show" role="alert" v-if="invalid">
            Il doit y avoir au moins une activité indépendante
        </div>
        </b-card>
    </b-container>
</template>

<script>
export default {
    name: 'dependanciesTable',

    data () {
        return {
            cardinal: 0,
            tasks: null,
            invalid: false,
        }
    },

    methods: {

      next: function () {
          this.tasks = this.formatTasks();
          this.$store.commit('setData', this.tasks);
          this.$router.push({name: 'algorithm'});
      },

      formatTasks: function () {
          let newFormattedTasks = [];

          this.tasks.forEach((task, index) => {

              let newFormattedTask = {};
              newFormattedTask.id = task.name;
              newFormattedTask.duration = task.timing;
              newFormattedTask.predecessors = [];

              this.getPredecessors(newFormattedTask, index);

              newFormattedTasks.push(newFormattedTask);
          });

          return newFormattedTasks;
      },

      getPredecessors: function (formattedTask, index) {
          var key;
          for (key in this.items[index]) {
              if (this.items[index][key]) {
                  formattedTask.predecessors.push(key);
              }
          }
      },

      check: function () {
          let checker = false;
          for (let i = 0; i < this.cardinal && !checker; i++) {
              let j = 0;
              for (j = 1; j <= this.cardinal && !(this.items[i]['T'+ j]); j++);
              checker = this.cardinal == j-1;
          }

          this.invalid = !checker;
      },

      checkNonReflectivity: function (one, another) {
          const one_ = 'T' + ++one;
          const another_ = Number(another[1]) - 1;
          return !(this.items[another_][one_]);
      }
    },

    computed: {
      fields () {
          let fields = [{key: 'task', label: 'Processus', class: 'font-weight-bold'}];
          for(let i = 0; i < this.cardinal; i++) {
              const name = this.tasks[i].name;
              fields.push(
                  {key: name,
                  label: name})
          }
          return fields;
      },

      items () {
        let items = [];
        for(let i = 0; i < this.cardinal; i++) {
            let item = {};
            for(let j = 0; j < this.cardinal; j++) {
                const name =  this.tasks[j].name;
                item[name] = false;
            }
            items.push(item);
        }
        return items;
      },
    },

    created () {
        this.cardinal = this.$store.getters.cardinal;
        this.tasks = this.$store.getters.data;
    }
}
</script>
