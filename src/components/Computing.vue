<template>
    <b-container class="animate__animated animate__fadeInRight mt-12 text-center">
        <h1> Etape finale</h1>
        <b-card text-variant="white" bg-variant="dark" header="Récapitulatif du réseau P.E.R.T" header-tag="header">
            <b-table :items="items" :fields="fields" :busy="isBusy" responsive striped hover caption-top dark bordered>

                <template v-slot:cell(task)="data">
                  {{ tasks[data.index].id }}
                </template>

                <template v-slot:cell(duration)="data">
                    <span class="badge badge-warning">{{ data.value }}</span>
                </template>

                <template v-slot:cell(critical_path) = "data">
                    <i v-if="data.item.h == 0" class="material-icons text-danger">checkbox</i>
                </template>

                <template v-slot:cell(est)="data">
                    <span class="badge badge-success">{{ data.value }}</span>
                </template>

                <template v-slot:cell(lst)="data">
                    <span class="badge badge-success">{{ data.value }}</span>
                </template>

                <template v-slot:cell(eet)="data">
                    <span class="badge badge-danger">{{ data.value }}</span>
                </template>

                <template v-slot:cell(let)="data">
                    <span class="badge badge-danger">{{ data.value }}</span>
                </template>

                <template v-slot:cell(h)="data">
                    <span class="badge badge-info">{{ data.value }}</span>
                </template>

                <template v-slot:table-caption>
                  Récapitulatif.
                </template>

                <template v-slot:table-busy>
                    <div class="text-center text-danger my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Exécution...</strong>
                    </div>
                </template>
            </b-table>

            <b-button v-if="!done" pill variant="secondary" class="mt-4" @click="run()">Exécuter l'algorithme</b-button>
            <p v-if="done" class="animate__animated animate__bounce">
                <span class="badge badge-primary">
                    Durée minimum du projet: {{ processDuration }}
                </span>
            </p>
            <b-button v-if="done" variant="outline-secondary" class="mt-4 text-white" to="/">Recommencer</b-button>

        </b-card>
    </b-container>
</template>

<script>
import { Activity, ActivityList, Preprocessor } from '../ActivityList';

export default {
    name: 'computing',

    data () {
        return {
            cardinal: 0,
            items: null,
            tasks: null,
            list: null,
            processDuration: null,
            isBusy: false,
            done: false,
        }
    },

    methods: {
        getItems: function () {
            let items = [];
            for (var task of this.tasks) {
                let item = {};
                item.duration = task.duration;
                item.predecessors = task.predecessors;
                item.est = null;
                item.lst = null;
                item.eet = null;
                item.let = null;
                item.h = null;

                items.push(item);
            }

            return items;
        },
        
        run: function () {
            this.isBusy = true;

            this.list = new ActivityList();
            var cloneList = new ActivityList();

            for (const task of this.tasks) {
                let activity = {
                    id: task.id,
                    duration: Number(task.duration),
                };
                if(task.predecessors.length) {
                    activity.predecessors = task.predecessors;
                }

                this.list.addActivity(new Activity(
                    activity
                ));
                cloneList.addActivity(new Activity(
                    activity
                ));
            }
            var prepare = new Preprocessor(cloneList.getStartNode());
            prepare.process();

            this.list.getCriticalPath(prepare.getMaxId(), prepare.getMaxLet());
            this.processDuration = prepare.getMaxLet();

            this.updateItems();
        },

        updateItems: function () {
            let i = 0;
            let newItems = this.list.getList();
            for (const key in newItems) {
                this.items[i].est = newItems[key].est;
                this.items[i].lst = newItems[key].lst;
                this.items[i].eet = newItems[key].eet;
                this.items[i].let = newItems[key].let;
                this.items[i++].h = newItems[key].h;
            }
            setTimeout(() => {
               this.isBusy = false;  this.done = true;
            }, 3000);
            
        }
    },

    computed: {

        fields () {
            return [
                {
                    key: 'task',
                    label: 'Activité',
                    class: 'font-weight-bold'
                },
                {
                    key: 'duration',
                    label: 'Durée',
                },
                {
                    key: 'predecessors',
                    label: 'Dépendances',
                    formatter: value => {
                        let cast_to_string = '';
                        value.forEach((el) => {cast_to_string += el + ', ';});
                        return (cast_to_string.length)? cast_to_string.substr(0, cast_to_string.length - 2) : '-';
                    }
                },
                {
                    key: 'est',
                    label: 'Début au plus tôt',
                },
                {
                    key: 'lst',
                    label: 'Début au plus tard',
                },
                {
                    key: 'eet',
                    label: 'Fin au plus tôt',
                },
                {
                    key: 'let',
                    label: 'Fin au plus tard',
                },
                {
                    key: 'h',
                    label: 'Marge',
                },
                {
                    key: 'critical_path',
                    label: 'Critique',
                    class: 'text-center',
                },
            ]
        }
    },

    created () {
        this.cardinal = this.$store.getters.cardinal;
        this.tasks = this.$store.getters.data;
        this.items = this.getItems();
    }
}
</script>