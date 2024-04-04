type props = {
    type: String,
}

function SubmitButton() {
    function handleClick(event: any): void {
      event.preventDefault();
      console.log("click is working")
        window.location.reload();
    }

  return (
    <button type="submit" onClick={handleClick}>Отправить</button>
  )
}

export default SubmitButton