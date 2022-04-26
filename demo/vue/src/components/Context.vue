<template>
  <div>
    <template v-if="$vuetify.breakpoint.smAndDown">
        <v-bottom-sheet v-bind="$attrs" v-on="$listeners">
        <slot />
        </v-bottom-sheet>
    </template>
    <template v-else>
      <v-menu v-bind="$attrs" v-on="$listeners" absolute offset-y>
        <slot />
      </v-menu>
    </template>
  </div>
</template>
<script>
export default {

}