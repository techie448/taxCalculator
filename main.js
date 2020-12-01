const app = new Vue({
    el: '#app',
    data: {
        pay: '',
        duration: 'biweek',
        error: '',
        result: null,
        loading: false,
    },
    methods: {
        async calculateTax() {
            if (this.pay && this.duration) {
                this.pay = this.pay.trim();
                try {
                    this.error = '';
                    this.result = null;
                    if(isNaN(this.pay)) throw new Error("Enter Pay.")
                    this.loading = true;
                    window.scrollTo(0, document.body.scrollHeight + 100);
                    const response = await fetch(`/api?pay=${this.pay}&duration=${this.duration}`);
                    if (response.ok) {
                        const result = await response.json();
                        this.loading = false;
                        this.result = result;
                    } else {
                        const result = await response.json();
                        this.loading = false;
                        this.error = result.message;
                    }
                } catch (err) {
                    this.error = err.message;
                }
            } else {
                this.error = "Please enter Pay, Duration"
            }
        },
    },
});
