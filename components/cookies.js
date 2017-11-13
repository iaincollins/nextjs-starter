export default class {
  static save(name,value,days) {
    if (typeof window === 'undefined') return
      
    let expires = ''
    if (days) {
      let date = new Date()
      date.setTime(date.getTime()+(days*24*60*60*1000))
      expires = '; expires='+date.toGMTString()
    }
    window.document.cookie = name+'='+value+expires+'; path=/'
  }

  static read(name) {
    if (typeof window === 'undefined') return
      
    const nameEQ = name + "="
    const cookies = window.document.cookie.split(';')
    for (let i=0; i < cookies.length; i++) {
      let c = cookies[i]
      while (c.charAt(0)==' ') c = c.substring(1,c.length)
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length)
    }
    return null
  }

  static delete(name) {
    if (typeof window === 'undefined') return
      
    this.save(name,"",-1)
  }
}