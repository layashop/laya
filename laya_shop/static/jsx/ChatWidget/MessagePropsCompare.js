const compareMessageProps = (prevProps, nextProps ) => {

    console.log('Prev Props', prevProps)
    console.log('Next Props', nextProps)
   const {message: prevMessage} = prevProps
   const {message: nextMessage} = nextProps
console.log('Prev Message', prevMessage)
    console.log('Next Message', nextMessage)
    console.log('Prev Date', prevMessage.send_date)
    console.log('Next Date', nextMessage.send_date)
   return prevMessage.send_date === nextMessage.send_date 
   && prevMessage.seen && nextMessage.seen
}

export default compareMessageProps