export const vibrateError = (navigator: Navigator) => {
    if ("vibrate" in navigator) navigator.vibrate(50)
}  

export const vibrateSuccess = () => {

}