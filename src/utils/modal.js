// '.open-modal' => open modal / '.close-modal' => close-modal
const initModalEventWithStatus = (status) => {
    document.querySelectorAll(`.${status}-modal`).forEach(el => {
        el.addEventListener('click', (e) => {
            document.querySelector(e.target.dataset.target).dataset.status = status
        })
    })
}

const initModalEvent = () => {
    initModalEventWithStatus('open')
    initModalEventWithStatus('close')
}


export { initModalEvent  }