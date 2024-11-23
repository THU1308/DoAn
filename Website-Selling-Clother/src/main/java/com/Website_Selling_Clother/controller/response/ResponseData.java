package com.Website_Selling_Clother.controller.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;

import java.util.List;

@Getter
public class ResponseData<T> {

    private final int statusCode;
    private final String message;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private T data;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Integer totalPage;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Integer pageNumber;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Integer pageSize;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private List<T> result;


    public ResponseData(int statusCode, String message) {
        this.statusCode = statusCode;
        this.message = message;
    }

    public ResponseData(HttpStatus statusCode, String message) {
        this.statusCode = statusCode.value();
        this.message = message;
    }

    public ResponseData(int statusCode, String message, T data) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }

    public ResponseData(HttpStatus statusCode, String message, T data) {
        this.statusCode = statusCode.value();
        this.message = message;
        this.data = data;
    }

    public ResponseData(T data) {
        this.statusCode = HttpStatus.OK.value();
        this.message = "Success";
        this.data = data;
    }

    public ResponseData(int statusCode, String message, Page<T> page) {
        this.statusCode = statusCode;
        this.message = message;
        this.result = page.getContent();
        this.totalPage = page.getTotalPages();
        this.pageNumber = page.getNumber();
        this.pageSize = page.getSize();
    }

    public ResponseData(Page<T> page) {
        this.statusCode = HttpStatus.OK.value();
        this.message = "";
        this.result = page.getContent();
        this.totalPage = page.getTotalPages();
        this.pageNumber = page.getNumber();
        this.pageSize = page.getSize();
    }
}
