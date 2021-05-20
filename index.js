import linebot from 'linebot'
import dotenv from 'dotenv'
import axios from 'axios'
import fs from 'fs'

dotenv.config()
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})
const formatDate = (date) => {
  return `${(date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1)}/${(date.getDate() < 10 ? '0' : '') + date.getDate()} ${(date.getHours() < 10 ? '0' : '') + date.getHours()}時`
}
bot.listen('/', process.env.PORT, () => {
  console.log('機器人啟動')
})
let reply = ''
bot.on('message', async event => {
  if (event.message.type === 'text') {
    if (event.message.text === '中文') {
      reply = '請輸入城市'
      event.reply(reply)
    } else if (event.message.text === '英文') {
      reply = 'Please enter the city'
      event.reply(reply)
    }
  }
})
bot.on('message', async event => {
  if (reply === '請輸入城市') {
    const flex = {
      type: 'carousel',
      contents: [
      ]
    }
    const bubbles = []
    if (event.message.type === 'text') {
      try {
        const response = await axios.get('https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/F-C0032-005?Authorization=CWB-AA78635B-E5B6-4705-AC06-10E5FB6D6F5F&format=JSON')
        const newCity = event.message.text.replace('台', '臺')
        for (const d of response.data.cwbopendata.dataset.location) {
          if (d.locationName === newCity) {
            for (let i = 0; i < 12; i++) {
              const b = {
                type: 'bubble',
                size: 'micro',
                direction: 'ltr',
                hero: {
                  type: 'image',
                  url: 'https://i.pinimg.com/736x/2d/77/7c/2d777c3912ddaa59f3278877dde5ecb6.jpg',
                  size: 'full',
                  aspectMode: 'cover',
                  aspectRatio: '320:213'
                },
                body: {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'text',
                      text: d.weatherElement[0].time[i].parameter.parameterName,
                      weight: 'bold',
                      size: 'lg',
                      wrap: true,
                      margin: 'sm',
                      style: 'italic',
                      offsetTop: 'xs',
                      decoration: 'none'
                    },
                    {
                      type: 'box',
                      layout: 'vertical',
                      contents: [
                        {
                          type: 'box',
                          layout: 'baseline',
                          contents: [
                            {
                              type: 'icon',
                              url: 'https://cdn2.iconfinder.com/data/icons/unigrid-phantom-multimedia-vol-4/60/020_200_calendar_date_schedule_event_month_year_2-512.png',
                              offsetTop: 'sm',
                              size: 'lg',
                              margin: 'none'
                            },
                            {
                              type: 'text',
                              text: formatDate(new Date(d.weatherElement[0].time[i].startTime)) + formatDate(new Date(d.weatherElement[0].time[i].endTime)),
                              size: 'md',
                              color: '#444444',
                              weight: 'bold',
                              wrap: true,
                              maxLines: 8,
                              margin: 'xs'
                            }
                          ]
                        }
                      ]
                    },
                    {
                      type: 'box',
                      layout: 'vertical',
                      contents: [
                        {
                          type: 'box',
                          layout: 'baseline',
                          spacing: 'sm',
                          contents: [
                            {
                              type: 'icon',
                              margin: 'none',
                              size: 'lg',
                              url: 'https://cdn4.iconfinder.com/data/icons/flat-pro-hardware-network-set-1/32/thermometer-red-512.png',
                              offsetTop: 'sm'
                            },
                            {
                              type: 'text',
                              text: d.weatherElement[1].time[i].parameter.parameterName,
                              wrap: true,
                              color: '#CC0000',
                              size: 'md',
                              flex: 0
                            },
                            {
                              type: 'icon',
                              url: 'https://cdn4.iconfinder.com/data/icons/flat-pro-hardware-network-set-1/32/thermometer-512.png',
                              size: 'lg',
                              offsetTop: 'sm',
                              margin: 'none'
                            },
                            {
                              type: 'text',
                              text: d.weatherElement[2].time[i].parameter.parameterName,
                              color: '#00BBFF',
                              size: 'md'
                            }
                          ]
                        }
                      ]
                    }
                  ],
                  spacing: 'xl',
                  paddingAll: '13px',
                  margin: 'none'
                },
                footer: {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'button',
                      action: {
                        type: 'postback',
                        label: '服裝搭配建議',
                        text: '這天適合穿著的服裝搭配',
                        data: '這天適合穿著的服裝搭配&' + d.weatherElement[1].time[i].parameter.parameterName
                      },
                      margin: 'xs'
                    }
                  ]
                }

              }
              bubbles.push(b)
            }
          }
        }
        const response1 = await axios.get('https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/F-C0032-007?Authorization=CWB-AA78635B-E5B6-4705-AC06-10E5FB6D6F5F&format=JSON')
        for (const d of response1.data.cwbopendata.dataset.location) {
          if (d.locationName === event.message.text) {
            for (let i = 0; i < 7; i++) {
              const b = {
                type: 'bubble',
                size: 'micro',
                direction: 'ltr',
                hero: {
                  type: 'image',
                  url: 'https://i.pinimg.com/736x/2d/77/7c/2d777c3912ddaa59f3278877dde5ecb6.jpg',
                  size: 'full',
                  aspectMode: 'cover',
                  aspectRatio: '320:213'
                },
                body: {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'text',
                      text: d.weatherElement[0].time[i].elementValue[0].value,
                      weight: 'bold',
                      size: 'lg',
                      wrap: true,
                      margin: 'sm',
                      style: 'italic',
                      offsetTop: 'xs',
                      decoration: 'none'
                    },
                    {
                      type: 'box',
                      layout: 'vertical',
                      contents: [
                        {
                          type: 'box',
                          layout: 'baseline',
                          contents: [
                            {
                              type: 'icon',
                              url: 'https://cdn2.iconfinder.com/data/icons/unigrid-phantom-multimedia-vol-4/60/020_200_calendar_date_schedule_event_month_year_2-512.png',
                              offsetTop: 'sm',
                              size: 'lg',
                              margin: 'none'
                            },
                            {
                              type: 'text',
                              text: formatDate(new Date(d.weatherElement[0].time[i].startTime)) + formatDate(new Date(d.weatherElement[0].time[i].endTime)),
                              size: 'md',
                              color: '#444444',
                              weight: 'bold',
                              wrap: true,
                              maxLines: 8,
                              margin: 'xs'
                            }
                          ]
                        }
                      ]
                    },
                    {
                      type: 'box',
                      layout: 'vertical',
                      contents: [
                        {
                          type: 'box',
                          layout: 'baseline',
                          spacing: 'sm',
                          contents: [
                            {
                              type: 'icon',
                              margin: 'none',
                              size: 'lg',
                              url: 'https://cdn4.iconfinder.com/data/icons/flat-pro-hardware-network-set-1/32/thermometer-red-512.png',
                              offsetTop: 'sm'
                            },
                            {
                              type: 'text',
                              text: d.weatherElement[1].time[i].elementValue.value,
                              wrap: true,
                              color: '#CC0000',
                              size: 'md',
                              flex: 0
                            },
                            {
                              type: 'icon',
                              url: 'https://cdn4.iconfinder.com/data/icons/flat-pro-hardware-network-set-1/32/thermometer-512.png',
                              size: 'lg',
                              offsetTop: 'sm',
                              margin: 'none'
                            },
                            {
                              type: 'text',
                              text: d.weatherElement[2].time[i].elementValue.value,
                              color: '#00BBFF',
                              size: 'md'
                            }
                          ]
                        }
                      ]
                    }
                  ],
                  spacing: 'xl',
                  paddingAll: '13px',
                  margin: 'none'
                },
                footer: {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'button',
                      action: {
                        type: 'postback',
                        label: '服裝搭配建議',
                        text: '這天適合穿著的服裝搭配',
                        data: '這天適合穿著的服裝搭配&' + d.weatherElement[1].time[i].elementValue.value
                      },
                      margin: 'xs'
                    }
                  ]
                }

              }
              bubbles.push(b)
            }
          }
        }
        flex.contents = bubbles
        const message = {
          type: 'flex',
          altText: '今天要看哪一城市天氣呢？',
          contents: flex
        }
        fs.writeFileSync('aaa.json', JSON.stringify(message, null, 2))
        event.reply(message)
      } catch (error) {
        event.reply('發生錯誤')
      }
    }
  } else if (reply === 'Please enter the city') {
    const flex = {
      type: 'carousel',
      contents: [
      ]
    }
    const bubbles = []
    if (event.message.type === 'text') {
      try {
        const response = await axios.get('https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/F-C0032-006?Authorization=CWB-AA78635B-E5B6-4705-AC06-10E5FB6D6F5F&format=JSON')
        const TaiwanChar = event.message.text.substring(0).toUpperCase()
        for (const d of response.data.cwbopendata.dataset.location) {
          if (d.locationName === TaiwanChar) {
            for (let i = 0; i < 12; i++) {
              const b = {
                type: 'bubble',
                size: 'micro',
                direction: 'ltr',
                hero: {
                  type: 'image',
                  url: 'https://i.pinimg.com/736x/2d/77/7c/2d777c3912ddaa59f3278877dde5ecb6.jpg',
                  size: 'full',
                  aspectMode: 'cover',
                  aspectRatio: '320:213'
                },
                body: {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'text',
                      text: d.weatherElement[0].time[i].parameter.parameterName,
                      weight: 'bold',
                      size: 'lg',
                      wrap: true,
                      margin: 'sm',
                      style: 'italic',
                      offsetTop: 'xs',
                      decoration: 'none'
                    },
                    {
                      type: 'box',
                      layout: 'vertical',
                      contents: [
                        {
                          type: 'box',
                          layout: 'baseline',
                          contents: [
                            {
                              type: 'icon',
                              url: 'https://cdn2.iconfinder.com/data/icons/unigrid-phantom-multimedia-vol-4/60/020_200_calendar_date_schedule_event_month_year_2-512.png',
                              offsetTop: 'sm',
                              size: 'lg',
                              margin: 'none'
                            },
                            {
                              type: 'text',
                              text: formatDate(new Date(d.weatherElement[0].time[i].startTime)) + formatDate(new Date(d.weatherElement[0].time[i].endTime)),
                              size: 'md',
                              color: '#444444',
                              weight: 'bold',
                              wrap: true,
                              maxLines: 8,
                              margin: 'xs'
                            }
                          ]
                        }
                      ]
                    },
                    {
                      type: 'box',
                      layout: 'vertical',
                      contents: [
                        {
                          type: 'box',
                          layout: 'baseline',
                          spacing: 'sm',
                          contents: [
                            {
                              type: 'icon',
                              margin: 'none',
                              size: 'lg',
                              url: 'https://cdn4.iconfinder.com/data/icons/flat-pro-hardware-network-set-1/32/thermometer-red-512.png',
                              offsetTop: 'sm'
                            },
                            {
                              type: 'text',
                              text: d.weatherElement[1].time[i].parameter.parameterName,
                              wrap: true,
                              color: '#CC0000',
                              size: 'md',
                              flex: 0
                            },
                            {
                              type: 'icon',
                              url: 'https://cdn4.iconfinder.com/data/icons/flat-pro-hardware-network-set-1/32/thermometer-512.png',
                              size: 'lg',
                              offsetTop: 'sm',
                              margin: 'none'
                            },
                            {
                              type: 'text',
                              text: d.weatherElement[2].time[i].parameter.parameterName,
                              color: '#00BBFF',
                              size: 'md'
                            }
                          ]
                        }
                      ]
                    }
                  ],
                  spacing: 'xl',
                  paddingAll: '13px',
                  margin: 'none'
                },
                footer: {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'button',
                      action: {
                        type: 'postback',
                        label: 'Clothing',
                        text: 'Suitable outfits to wear this day',
                        data: 'Suitable outfits to wear this day&' + d.weatherElement[1].time[i].parameter.parameterName
                      },
                      margin: 'xs'
                    }
                  ]
                }

              }
              bubbles.push(b)
            }
          }
        }
        const response1 = await axios.get('https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/F-C0032-008?Authorization=CWB-AA78635B-E5B6-4705-AC06-10E5FB6D6F5F&format=JSON')
        const tmpChar = event.message.text.substring(0, 1).toUpperCase()
        const postString = event.message.text.substring(1).toLowerCase()
        const tmpStr = tmpChar + postString
        for (const d of response1.data.cwbopendata.dataset.location) {
          if (d.locationName === tmpStr) {
            for (let i = 0; i < 7; i++) {
              const b = {
                type: 'bubble',
                size: 'micro',
                direction: 'ltr',
                hero: {
                  type: 'image',
                  url: 'https://i.pinimg.com/736x/2d/77/7c/2d777c3912ddaa59f3278877dde5ecb6.jpg',
                  size: 'full',
                  aspectMode: 'cover',
                  aspectRatio: '320:213'
                },
                body: {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'text',
                      text: d.weatherElement[0].time[i].elementValue[0].value,
                      weight: 'bold',
                      size: 'lg',
                      wrap: true,
                      margin: 'sm',
                      style: 'italic',
                      offsetTop: 'xs',
                      decoration: 'none'
                    },
                    {
                      type: 'box',
                      layout: 'vertical',
                      contents: [
                        {
                          type: 'box',
                          layout: 'baseline',
                          contents: [
                            {
                              type: 'icon',
                              url: 'https://cdn2.iconfinder.com/data/icons/unigrid-phantom-multimedia-vol-4/60/020_200_calendar_date_schedule_event_month_year_2-512.png',
                              offsetTop: 'sm',
                              size: 'lg',
                              margin: 'none'
                            },
                            {
                              type: 'text',
                              text: formatDate(new Date(d.weatherElement[0].time[i].startTime)) + formatDate(new Date(d.weatherElement[0].time[i].endTime)),
                              size: 'md',
                              color: '#444444',
                              weight: 'bold',
                              wrap: true,
                              maxLines: 8,
                              margin: 'xs'
                            }
                          ]
                        }
                      ]
                    },
                    {
                      type: 'box',
                      layout: 'vertical',
                      contents: [
                        {
                          type: 'box',
                          layout: 'baseline',
                          spacing: 'sm',
                          contents: [
                            {
                              type: 'icon',
                              margin: 'none',
                              size: 'lg',
                              url: 'https://cdn4.iconfinder.com/data/icons/flat-pro-hardware-network-set-1/32/thermometer-red-512.png',
                              offsetTop: 'sm'
                            },
                            {
                              type: 'text',
                              text: d.weatherElement[1].time[i].elementValue.value,
                              wrap: true,
                              color: '#CC0000',
                              size: 'md',
                              flex: 0
                            },
                            {
                              type: 'icon',
                              url: 'https://cdn4.iconfinder.com/data/icons/flat-pro-hardware-network-set-1/32/thermometer-512.png',
                              size: 'lg',
                              offsetTop: 'sm',
                              margin: 'none'
                            },
                            {
                              type: 'text',
                              text: d.weatherElement[2].time[i].elementValue.value,
                              color: '#00BBFF',
                              size: 'md'
                            }
                          ]
                        }
                      ]
                    }
                  ],
                  spacing: 'xl',
                  paddingAll: '13px',
                  margin: 'none'
                },
                footer: {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'button',
                      action: {
                        type: 'postback',
                        label: 'Clothing',
                        text: 'Suitable outfits to wear this day',
                        data: 'Suitable outfits to wear this day&' + d.weatherElement[1].time[i].elementValue.value
                      },
                      margin: 'xs'
                    }
                  ]
                }

              }
              bubbles.push(b)
            }
          }
        }
        flex.contents = bubbles
        const message = {
          type: 'flex',
          altText: 'Which city weather do you want to see today？',
          contents: flex
        }
        fs.writeFileSync('aaa.json', JSON.stringify(message, null, 2))
        event.reply(message)
      } catch (error) {
        event.reply('發生錯誤')
      }
    }
  }
})
bot.on('postback', async event => {
  let temp = ''
  if (event.postback.data.slice(0, 11) === '這天適合穿著的服裝搭配') {
    temp = event.postback.data.slice(12)
    if (temp > 30) {
      event.reply({
        type: 'image',
        originalContentUrl: 'https://raw.githubusercontent.com/chiawei913/-line-/main/images/30.jpg',
        previewImageUrl: 'https://raw.githubusercontent.com/chiawei913/-line-/main/images/30.jpg'
      })
    } else if (temp > 25 && temp <= 30) {
      event.reply({
        type: 'image',
        originalContentUrl: 'https://raw.githubusercontent.com/chiawei913/-line-/main/images/25.jpg',
        previewImageUrl: 'https://raw.githubusercontent.com/chiawei913/-line-/main/images/25.jpg'
      })
    } else if (temp > 20 && temp <= 25) {
      event.reply({
        type: 'image',
        originalContentUrl: 'https://raw.githubusercontent.com/chiawei913/-line-/main/images/20.jpg',
        previewImageUrl: 'https://raw.githubusercontent.com/chiawei913/-line-/main/images/20.jpg'
      })
    } else if (temp > 15 && temp <= 20) {
      event.reply({
        type: 'image',
        originalContentUrl: 'https://raw.githubusercontent.com/chiawei913/-line-/main/images/15.jpg',
        previewImageUrl: 'https://raw.githubusercontent.com/chiawei913/-line-/main/images/15.jpg'
      })
    } else if (temp <= 15) {
      event.reply({
        type: 'image',
        originalContentUrl: 'https://raw.githubusercontent.com/chiawei913/-line-/main/images/10.jpg',
        previewImageUrl: 'https://raw.githubusercontent.com/chiawei913/-line-/main/images/10.jpg'
      })
    }
  } else if (event.postback.data.slice(0, 33) === 'Suitable outfits to wear this day') {
    temp = event.postback.data.slice(34)
    if (temp > 30) {
      event.reply({
        type: 'image',
        originalContentUrl: 'https://raw.githubusercontent.com/chiawei913/-line-/main/images/30.jpg',
        previewImageUrl: 'https://raw.githubusercontent.com/chiawei913/-line-/main/images/30.jpg'
      })
    } else if (temp > 25 && temp <= 30) {
      event.reply({
        type: 'image',
        originalContentUrl: 'https://raw.githubusercontent.com/chiawei913/-line-/main/images/25.jpg',
        previewImageUrl: 'https://raw.githubusercontent.com/chiawei913/-line-/main/images/25.jpg'
      })
    } else if (temp > 20 && temp <= 25) {
      event.reply({
        type: 'image',
        originalContentUrl: 'https://raw.githubusercontent.com/chiawei913/-line-/main/images/20.jpg',
        previewImageUrl: 'https://raw.githubusercontent.com/chiawei913/-line-/main/images/20.jpg'
      })
    } else if (temp > 15 && temp <= 20) {
      event.reply({
        type: 'image',
        originalContentUrl: 'https://raw.githubusercontent.com/chiawei913/-line-/main/images/15.jpg',
        previewImageUrl: 'https://raw.githubusercontent.com/chiawei913/-line-/main/images/15.jpg'
      })
    } else if (temp <= 15) {
      event.reply({
        type: 'image',
        originalContentUrl: 'https://raw.githubusercontent.com/chiawei913/-line-/main/images/10.jpg',
        previewImageUrl: 'https://raw.githubusercontent.com/chiawei913/-line-/main/images/10.jpg'
      })
    }
  }
})
