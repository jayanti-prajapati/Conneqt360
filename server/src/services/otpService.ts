import axios from "axios";

const unirest = require('unirest');


export const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000);
};
export const sendOTP = (phoneNumber: number, otp: number) => {
    const req = unirest('GET', 'https://www.fast2sms.com/dev/bulkV2');

    // req.query({
    //     authorization: "5lN9fusWtfezWXkgCE18LYoVbv3IxiDmHg50eWKriqCcXSOTUgHy1LIYuN1G",
    //     // variables_values: otp,
    //     "content-type": "application/x-www-form-urlencoded",
    //     // route: 'otp',
    //     numbers: phoneNumber,
    // });

    // req.headers({
    //     'cache-control': 'no-cache'
    // });
    axios.post("https://www.fast2sms.com/dev/bulkV2", {
        route: "otp",
        variables_values: "123456",
        numbers: "7600751136"
    }, {
        headers: {

            "authorization": "83BnF5ir0kOclNmirMWydz3VeqOKXtLKvcrJff6jhPTYdYla25Eh4MPRGZcV".trim(),
            "Content-Type": "application/json"
        }
    })
        .then(res => console.log(res.data))
        .catch(err => console.error(err.response.data));
    // console.log("reg otp", otp);
    // var request = axios.post("https://www.fast2sms.com/dev/bulkV2");
    // request.headers(

    //     {

    //         "authorization": "83BnF5ir0kOclNmirMWydz3VeqOKXtLKvcrJff6jhPTYdYla25Eh4MPRGZcV".trim(),
    //         "Content-Type": "application/json"
    //     }
    // );
    // req.send(JSON.stringify({
    //     route: "otp",
    //     variables_values: "123456",          // your dynamic OTP here
    //     numbers: "7600751136"                // recipient mobile number
    // }));
    //    uest.form(
    //         {

    //             "route": "otp",

    //             "numbers": phoneNumber,
    //             "variables_values": otp,
    //         }

    //     );


    req.end((res: { error: any; body: any; }) => {
        if (res.error) {
            console.error('OTP sending failed:', res.body);
            throw new Error('Failed to send OTP');
        }
        console.log('OTP sent successfully:', res.body);
    });
};


