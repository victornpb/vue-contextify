<template>
  <div>
    <v-data-table
      :headers="headerArray"
      :items="itemsArray"
      :search="search"
      :hide-default-header="hideHeaders"
      :show-select="showSelect"
      :loading="isLoading"
      hide-default-footer
      item-key="name"
      class="elevation-1"
    >
      <template v-slot:body="{ items }">
        <tbody>
          <tr
            v-for="item in items"
            :key="item.name"
            data-shortcut-component
            v-context-menu.foobar="item"
          >
            <td :title="item.name">{{ item.name }}</td>
            <td>{{item.calories}}</td>
            <td>{{item.fat}}</td>
            <td>Foo {{item.carbs}}</td>
            <td>
              <v-btn @click="alert('Remove')" icon title="Remove"><v-icon>mdi-delete</v-icon></v-btn>
            </td>
            <td>
              <v-btn @click="alert('Previous')" icon title="Previous"><v-icon>mdi-skip-previous</v-icon></v-btn>
              <v-btn @click="alert('Play')" icon title="Play"><v-icon>mdi-play</v-icon></v-btn>
              <v-btn @click="alert('Next')" icon title="Next"><v-icon>mdi-skip-next</v-icon></v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-data-table>

    <VContextMenu name="foobar" v-slot="{item, opened, event, close}">
      <Context :value="opened" @input="close()" :position-x="event.x" :position-y="event.y">
        <v-list>
          <v-list-item @click="alert('Open')">
            <v-list-item-title>
              <v-icon></v-icon>
              Open {{ item.name }}
            </v-list-item-title>
          </v-list-item>

          <v-list-item @click="alert('Delete')">
            <v-list-item-title>
              <v-icon>mdi-delete</v-icon>
              Delete
            </v-list-item-title>
          </v-list-item>

          <v-list-item @click="alert('Edit')">
            <v-list-item-title>
              <v-icon>mdi-pencil</v-icon>
              Edit
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </Context>
    </VContextMenu>
  </div>
</template>
<script>
import desserts from './dummyData';
import Context from '../../components/Context.vue';


export default {
  components:{Context},
  data() {
    return {
      enabled: null,
      itemsArray: desserts,
      search: null,
      slots: [
        "body",
        "body.append",
        "body.prepend",
        "footer",
        "header.data-table-select",
        "header",
        "progress",
        "item.data-table-select",
        "item.<name>",
        "no-data",
        "no-results",
        "top",
      ],
      headerArray: [
        {
          text: "Dessert (100g serving)",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "Calories", value: "calories" },
        { text: "Fat (g)", value: "fat" },
        { text: "Carbs (g)", value: "carbs" },
        { text: "Protein (g)", value: "protein" },
        { text: "Iron (%)", value: "iron" },
      ],
    };
  },

  computed: {
    showSelect() {
      return (
        this.isEnabled("header.data-table-select") ||
        this.isEnabled("item.data-table-select")
      );
    },
    hideHeaders() {
      return !this.showSelect;
    },
    isLoading() {
      return this.isEnabled("progress");
    },
  },

  watch: {
    enabled(slot) {
      if (slot === "no-data") {
        this.items = [];
      } else if (slot === "no-results") {
        this.search = "...";
      } else {
        this.search = null;
        this.items = desserts;
      }
    },
  },

  methods: {
    isEnabled(slot) {
      return this.enabled === slot;
    },
    alert(a) {
      window.alert('clicked', a);
    },
  },
};
</script>