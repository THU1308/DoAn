package com.Website_Selling_Clother.controller;

import com.Website_Selling_Clother.controller.response.ResponseData;
import com.Website_Selling_Clother.vnpay_config.Config;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("${api.prefix}")
public class VNPayController {

//    @GetMapping("/vnpay_return")
//    public ResponseData<?> handleVnpayReturn(HttpServletRequest request, HttpServletResponse res) throws IOException {
//        // Lấy các tham số trả về từ URL
//        String vnp_SecureHash = request.getParameter("vnp_SecureHash");
//        String vnp_TxnRef = request.getParameter("vnp_TxnRef");
//        String vnp_Amount = request.getParameter("vnp_Amount");
//        String vnp_ResponseCode = request.getParameter("vnp_ResponseCode");
//        String vnp_TransactionNo = request.getParameter("vnp_TransactionNo");
//        String vnp_CurrCode = request.getParameter("vnp_CurrCode");
//        String vnp_PayDate = request.getParameter("vnp_PayDate");
//        String vnp_BankCode = request.getParameter("vnp_BankCode");
//        String vnp_OrderInfo = request.getParameter("vnp_OrderInfo");
//        String vnp_CardType = request.getParameter("vnp_CardType");
//
//
//        // Kiểm tra mã giao dịch trả về (nếu mã trả về là "00", thanh toán thành công)
//        if ("00".equals(vnp_ResponseCode)) {
//
//            Map<String, String> response = new HashMap<>();
//            response.put("code", "00");
//            response.put("message", "Transaction successful.");
//            response.put("transactionId", vnp_TxnRef);
//
//            return new ResponseData<>(HttpStatus.OK, "Payment Successful", response);
//        }
//        Map<String, String> response = new HashMap<>();
//        response.put("code", "01");
//        response.put("message", "Transaction fail.");
//        response.put("transactionId", vnp_TxnRef);
//        return new ResponseData<>(HttpStatus.OK, "Payment fail", response);
//    }


    @GetMapping("/api/vnpay/create")
    public ResponseData<?> createPayment(HttpServletRequest request, @RequestParam Long totalAmount) throws UnsupportedEncodingException {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String orderType = "other";
        String vnp_TxnRef = Config.getRandomNumber(8);
        String vnp_IpAddr = Config.getIpAddress(request);
        String vnp_TmnCode = Config.vnp_TmnCode;
        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(totalAmount * 100));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_BankCode", "NCB");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang:" + vnp_TxnRef);
        vnp_Params.put("vnp_OrderType", orderType);
        vnp_Params.put("vnp_ReturnUrl", Config.vnp_ReturnUrl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List fieldNames = new ArrayList(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = (String) vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                //Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                //Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        //System.out.println(hashData);
        String queryUrl = query.toString();
        String vnp_SecureHash = Config.hmacSHA512(Config.secretKey, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = Config.vnp_PayUrl + "?" + queryUrl;
        Map<String, String> response = new HashMap<>();
        response.put("message", "success");
        response.put("paymentUrl", paymentUrl);
        response.put("returnUrl", Config.vnp_ReturnUrl);

        return new ResponseData<>(HttpStatus.OK, "Success", response);
    }
}
