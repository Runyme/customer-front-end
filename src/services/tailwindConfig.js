import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../tailwind.config'

const fullConfig = resolveConfig(tailwindConfig)

export const twColors = fullConfig.theme.colors

export const twFonts = fullConfig.theme.fontFamily