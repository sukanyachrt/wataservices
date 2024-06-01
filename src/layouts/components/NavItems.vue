<script setup>
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue';
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue';
import VerticalNavGroup from '@layouts/components/VerticalNavGroup.vue'
</script>

<template>
 
 <VerticalNavLink
    :item="{
      title: 'Platforms',
      icon: 'ri-list-view',
      to: '/platforms',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Services',
      icon: 'ri-service-line',
      to: '/services',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Project',
      icon: 'ri-list-check-3',
      to: '/project',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Team ',
      icon: 'ri-team-line',
      to: '/teams',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'User',
      icon: 'ri-user-fill',
      to: '/users',
    }"
  />
  <VerticalNavGroup
    
    :item="{
      title: 'Project',
      icon: 'ri-list-check-3',
      to: '/project',
    }"
  >
    <VerticalNavLink
      :item="{
        title: 'Table',
        to: '/project?type=table',
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Dashboard',
        to: '/project?type=dashboard',
      }"
    />
  </VerticalNavGroup> 
 <VerticalNavLink
    :item="{
      title: 'Account Settings',
      icon: 'ri-user-settings-line',
      to: '/account-settings',
    }"
  />

  <VerticalNavLink
    :item="{
      title: 'Login',
      icon: 'ri-login-box-line',
      to: '/login',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Register',
      icon: 'ri-user-add-line',
      to: '/register',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Error',
      icon: 'ri-information-line',
      to: '/no-existence',
    }"
  />

  <VerticalNavSectionTitle
    :item="{
      heading: 'User Interface',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Typography',
      icon: 'ri-text',
      to: '/typography',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Icons',
      icon: 'ri-remixicon-line',
      to: '/icons',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Cards',
      icon: 'ri-bar-chart-box-line',
      to: '/cards',
    }"
  />

  <VerticalNavSectionTitle
    :item="{
      heading: 'Forms & Tables',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Form Layouts',
      icon: 'ri-layout-4-line',
      to: '/form-layouts',
    }"
  />
  
  <VerticalNavLink
    :item="{
      title: 'Tables',
      icon: 'ri-table-alt-line',
      to: '/tables',
    }"
  />

</template>
