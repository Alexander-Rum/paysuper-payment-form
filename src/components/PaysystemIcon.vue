<script>
export default {
  name: 'PaysystemIcon',
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      typeToIconComponentMap: {
        visa: 'IconPaysystemVisa',
        mastercard: 'IconPaysystemMastercard',
        'american-express': 'IconPaysystemAmex',
        'diners-club': 'IconPaysystemDinersClub',
        discover: 'IconPaysystemDiscover',
        jcb: 'IconPaysystemJcb',
        unionpay: 'IconPaysystemUnionPay',
        maestro: 'IconPaysystemMaestro',
        mir: 'IconPaysystemMir',
        elo: 'IconPaysystemElo',
        hiper: 'IconPaysystemHipercard',
        hipercard: 'IconPaysystemHipercard',
      },
    };
  },
  computed: {
    component() {
      return this.typeToIconComponentMap[this.type];
    },
  },
};
</script>

<template>
<component
  v-if="component"
  :is="component"
  width="27"
  height="15"
/>
</template>
