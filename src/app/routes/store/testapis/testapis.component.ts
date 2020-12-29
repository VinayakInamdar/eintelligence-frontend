import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from '../store.service';
import { IProduct } from '../product.model';
import { JsonPipe } from '@angular/common';
import { StripeService } from "ngx-stripe";
import {
  StripeCardElementOptions,
  StripeElementsOptions,
  StripeElement
} from '@stripe/stripe-js';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';

declare var Stripe;


@Component({
  templateUrl: './testapis.component.html',
  styleUrls: ['./testapis.component.scss']
})
export class TestApisComponent implements OnInit {

  httpOptionJSON = {
		headers: new HttpHeaders({
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': 'Bearer sk_test_51I0iLaEKoP0zJ89QzP2qwrKaIC8vjEfoVim8j4S0Y3FsRx0T3UEkvqiaEayt1AzAcP7Na5xzZcb7aN2K7aMrtcMf00CizHVXeg'
		})
	};
  cardObject: any = {
		email: '',
		billingName: '',
		billingCountry: '',
	}
  clientSecret = 'sk_test_51I0iLaEKoP0zJ89QzP2qwrKaIC8vjEfoVim8j4S0Y3FsRx0T3UEkvqiaEayt1AzAcP7Na5xzZcb7aN2K7aMrtcMf00CizHVXeg';
  card: StripeElement;
  stripeTest: FormGroup;
 
  
  constructor(public router :Router, public productService : StoreService,private http: HttpClient,
		private stripeService: StripeService,) { }

  ngOnInit(): void {
    this.stripeInit();
    
  }

//################StripeFuncation###################
stripeInit() {
  var stripe = Stripe("pk_test_nMy1SsrmgzxpNRC9SAQjEvbw00qM5rUAjB");
  document.querySelector("#submit")['disabled'] = true;
  var elements = stripe.elements();
  var style = {
    base: {
      color: "#32325d",
      fontFamily: 'Arial, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#32325d"
      }
    },
    invalid: {
      fontFamily: 'Arial, sans-serif',
      color: "#fa755a",
      iconColor: "#fa755a"
    }
  };

  var card = elements.create("card", { style: style });

  this.paymentIntentCall();

  // Stripe injects an iframe into the DOM
  card.mount("#card-element");

  card.on("change", function (event) {
    // Disable the Pay button if there are no card details in the Element
    document.querySelector("#submit")['disabled'] = event.empty;
    document.querySelector("#card-errors").textContent = event.error ? event.error.message : "";
  });

  var form = document.getElementById("payment-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    // Complete payment when the submit button is clicked
    this.payWithCard(stripe, card, this.clientSecret);
  });
}
paymentIntentCall() {
  const url = "https://api.stripe.com/v1/payment_intents";
  const body = new URLSearchParams();
  body.set('amount', '500');
  body.set('currency', 'inr');
  body.set('payment_method_types[]', 'card');

  this.http.post(url, body.toString(), this.httpOptionJSON).subscribe(res => {
    if (res) {
      debugger
      this.clientSecret = res['id'];
    }
  }, error => {
    alert(error.message);
  });
}
payWithCard(stripe, card, clientSecret) {
  debugger
  this.loading(true);
  const url = "https://api.stripe.com/v1/payment_intents/"+this.clientSecret+"/confirm";
  const body = new URLSearchParams();
  body.set('payment_method', 'pm_card_visa');

  this.http.post(url, body.toString(), this.httpOptionJSON).subscribe(res => {
    if (res) {
      debugger
      this.clientSecret = res['client_secret'];
    }
  }, error => {
    alert(error.message);
  });


  // stripe
  //   .confirmCardPayment(clientSecret, {
  //     payment_method: 'pm_card_visa'
  //     // payment_method: {
  //     //   card: card,
  //     //   billing_details: {
  //     //     name: this.cardObject.billingName,
  //     //     email: this.cardObject.email,
  //     //     address: {
  //     //       country: this.cardObject.billingCountry
  //     //     }
  //     //   }
  //     // }
  //   })
  //   .then((result) => {
  //     if (result.error) {
  //       // Show error to your customer
  //       this.showError(result.error.message);
  //     } else {
  //       // The payment succeeded!
  //       this.orderComplete(result.paymentIntent.id);
  //     }
  //   });
}
orderComplete(paymentIntentId) {
  debugger
  this.loading(false);
  document.querySelector(".result-message").classList.remove("hidden");
  document.querySelector("#submit")['disabled'] = true;
}
showError(errorMsgText) {
  debugger
  this.loading(false);
  var errorMsg = document.querySelector("#card-errors");
  errorMsg.textContent = errorMsgText;
  setTimeout(() => {
    errorMsg.textContent = "";
  }, 4000);
}
loading(isLoading) {
  if (isLoading) {
    // Disable the button and show a spinner
    document.querySelector("#submit")['disabled'] = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("#submit")['disabled'] = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
}
//################StripeSubscriptionFuncation##########
stripeSubInit() {
  var stripe = Stripe("pk_test_lhxvqE7w2tJsBlOrSlipgTIN00eDBEQMuy");
  document.querySelector("#submit")['disabled'] = true;
  var elements = stripe.elements();
  var style = {
    base: {
      color: "#32325d",
      fontFamily: 'Arial, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#32325d"
      }
    },
    invalid: {
      fontFamily: 'Arial, sans-serif',
      color: "#fa755a",
      iconColor: "#fa755a"
    }
  };
  var card = elements.create("card", { style: style });
  // Stripe injects an iframe into the DOM
  card.mount("#card-element");

  card.on("change", function (event) {
    // Disable the Pay button if there are no card details in the Element
    document.querySelector("#submit")['disabled'] = event.empty;
    document.querySelector("#card-errors").textContent = event.error ? event.error.message : "";
  });

  var form = document.getElementById("subscription-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    // Complete payment when the submit button is clicked
    this.createPaymentMethod(stripe, card);
  });
}
createPaymentMethod(stripe, cardElement) {
  debugger
  stripe.createPaymentMethod({
    type: 'card',
    card: cardElement,
    billing_details: {
      name: this.cardObject.email,
    }
  }).then((result) => {
    console.log(result.paymentMethod.id);
  });
}
}

