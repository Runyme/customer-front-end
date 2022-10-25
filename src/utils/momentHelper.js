import moment from 'moment'

export const formatToEn = (date) => {
  return date.format('YYYY-MM-DD')
}

export const formatBrToEn = (date) => {
  return moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD')
}

export const formatEnToBr = (date) => {
  return moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY')
}