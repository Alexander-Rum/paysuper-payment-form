<template>
<svg width="147" height="161" viewBox="0 0 147 161" fill="none">
  <!-- eslint-disable -->
  <g>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M76.9998 48C65.9541 48 56.9998 56.9543 56.9998 68V75H6.99976V76C6.99976 96.9868 24.0129 114 44.9998 114H56.9998V146H55.9998C48.2678 146 41.9998 152.268 41.9998 160V161H112V160C112 152.268 105.732 146 97.9998 146H96.9998V114H109C129.987 114 147 96.9868 147 76V75H96.9998V68C96.9998 56.9543 88.0454 48 76.9998 48Z" :fill="$gui.iconBaseColor"/>
    <path d="M63.9998 124L52.4998 111.5" :stroke="$gui.iconSublineColor" stroke-width="3" stroke-linecap="round"/>
    <path d="M51.9998 58C51.9998 46.9543 60.9541 38 71.9998 38V38C83.0455 38 91.9998 46.9543 91.9998 58V136H51.9998V58Z" :stroke="$gui.iconOutlineColor" stroke-width="3"/>
    <path d="M36.9998 150C36.9998 142.268 43.2678 136 50.9998 136H92.9998C100.732 136 107 142.268 107 150V151H36.9998V150Z" :stroke="$gui.iconOutlineColor" stroke-width="3"/>
    <path d="M91.9998 65H142V66C142 86.9868 124.987 104 104 104H91.9998V65Z" :stroke="$gui.iconOutlineColor" stroke-width="3"/>
    <path d="M92 104H52" :stroke="$gui.iconOutlineColor" stroke-width="3" stroke-linecap="round"/>
    <path d="M62.9998 91H36.9998" :stroke="$gui.iconPositiveColor" stroke-width="3" stroke-linecap="round"/>
    <path d="M51.9998 65H1.99976V66C1.99976 86.9868 19.0129 104 39.9998 104H51.9998V65Z" :stroke="$gui.iconOutlineColor" stroke-width="3"/>
    <path d="M119 79H25" :stroke="$gui.iconPositiveColor" stroke-width="3" stroke-linecap="round"/>
    <path d="M105 91H88" :stroke="$gui.iconSublineColor" stroke-width="3" stroke-linecap="round"/>
    <path d="M71.9998 117L83.2581 104.5H60.7415L71.9998 117Z" :stroke="$gui.iconOutlineColor" stroke-width="3"/>
    <path d="M72 85L72 69" :stroke="$gui.iconOutlineColor" stroke-width="3" stroke-linecap="round"/>
    <path d="M63.9998 141.5L93.9998 108.5" :stroke="$gui.iconPositiveColor" stroke-width="3" stroke-linecap="round"/>
    <circle cx="63.9998" cy="58" r="5" :stroke="$gui.iconOutlineColor" stroke-width="3"/>
    <circle class="winking-eye" cx="79.9998" cy="58" r="5" :stroke="$gui.iconOutlineColor" stroke-width="3"/>
  </g>

  <path class="check" d="M56 31.5642L71.9594 45.608L96.2165 20.7121" :stroke="$gui.iconPositiveColor" stroke-width="3" stroke-linecap="round"/>

  <g class="anim-elem _elem-1">
    <path d="M44 8.6055L57.3782 21.9829" :stroke="$gui.iconOutlineColor" stroke-width="3" stroke-linecap="round"/>
    <circle cx="105.408" cy="47.4082" r="1.40816" :fill="$gui.iconPositiveColor"/>
  </g>
  <path class="anim-elem _elem-2" d="M118.561 29L105.561 34.8636" :stroke="$gui.iconSublineColor" stroke-width="3" stroke-linecap="round"/>
  <g class="anim-elem _elem-3">
    <path d="M88.3979 2L83.8733 16.0265" :stroke="$gui.iconOutlineColor" stroke-width="3" stroke-linecap="round"/>
    <circle cx="110.408" cy="20.4082" r="1.40816" :fill="$gui.iconPositiveColor"/>
  </g>
  <g class="anim-elem _elem-4">
    <path d="M30 36.62L41.9998 39.62" :stroke="$gui.iconSublineColor" stroke-width="3" stroke-linecap="round"/>
    <circle cx="28.4082" cy="51.4082" r="1.40816" :fill="$gui.iconPositiveColor"/>
  </g>
  <g class="anim-elem _elem-5">
    <path d="M69.0001 12.0583L70.8991 22.4347" :stroke="$gui.iconSublineColor" stroke-width="3" stroke-linecap="round"/>
    <circle cx="44.4082" cy="30.4082" r="1.40816" :fill="$gui.iconSublineColor"/>
  </g>
</svg>

</template>

<style lang="scss" scoped>
.anim-elem {
  opacity: 0;
  animation: {
    name: showPart;
    duration: 0.2s;
    timing-function: linear;
    iteration-count: 1;
    fill-mode: forwards;
  }

  @for $i from 1 to 6 {
    &._elem-#{$i} {
      animation-delay: 0.8s + 0.15s * $i;
    }
  }
}
.check {
  transform: scale(1.6);
  opacity: 0;
  transform-origin: 30px center;
  transform-box: fill-box;
  animation: {
    name: showCheck;
    duration: 0.3s;
    timing-function: linear;
    iteration-count: 1;
    fill-mode: forwards;
    delay: 0.6s;
  }
}
.winking-eye {
  transform-origin: center center;
  transform-box: fill-box;
  animation: {
    name: wink;
    duration: 0.5s;
    timing-function: linear;
    iteration-count: 1;
    fill-mode: forwards;
    delay: 2.2s;
  }
}

@keyframes showPart {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes showCheck {
  0% {
    opacity: 0;
    transform: scale(1.6);
  }
  75% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes wink {
  0% {
    transform: scaleY(1);
  }
  35% {
    transform: scaleY(0.15);
  }
  65% {
    transform: scaleY(0.15);
  }
  100% {
    transform: scaleY(1);
  }
}
</style>
