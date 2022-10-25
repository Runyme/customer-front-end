import Vue from 'vue'
import {upperFirst, camelCase} from 'lodash'

const requireComponent = require.context(
  '.', false, /[\w-]+\.vue$/ 
)

requireComponent.keys().forEach( fileName => {
  
  const componentConfig = requireComponent(fileName)
  
  const componentName = upperFirst(
    camelCase( fileName.replace(/^\.\//, '').replace(/\.\w+$/, '') )
  )

  Vue.component(`MB-${componentName}`, componentConfig.default || componentConfig )
})