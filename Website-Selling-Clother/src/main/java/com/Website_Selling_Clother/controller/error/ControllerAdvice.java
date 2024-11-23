package com.Website_Selling_Clother.controller.error;

import com.Website_Selling_Clother.controller.response.ResponseData;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.nio.file.AccessDeniedException;
import java.util.List;


@RestControllerAdvice
@Slf4j
public class ControllerAdvice {

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler
    public ResponseData<String> handleException(Exception ex) {
        log.debug("------handleException {}", ex.getMessage());
        return new ResponseData<>(HttpStatus.BAD_REQUEST, ex.getMessage());
    }
    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseData<String> handleEntitiesNotFoundException(EntityNotFoundException ex) {
        log.debug("------handleEntitiesNotFoundException {}", ex.getMessage());
        return new ResponseData<>(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseData<String> handleIllegalArgumentException(IllegalArgumentException ex) {
        log.debug("------handleIllegalArgumentException {}", ex.getMessage());
        return new ResponseData<>(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseData<String> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        List<ObjectError> errors = ex.getBindingResult().getAllErrors();
        StringBuilder msg = new StringBuilder();

        for (ObjectError err : errors) {
            FieldError fieldError =  (FieldError) err;
            msg.append(fieldError.getField()).append(":").append(err.getDefaultMessage());
        }

        log.debug("------handleMethodArgumentNotValidException {}", msg);
        return new ResponseData<>(HttpStatus.UNPROCESSABLE_ENTITY, msg.toString());
    }
    @ResponseStatus(HttpStatus.CONFLICT)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseData<String> handleDataIntegrityViolationException(DataIntegrityViolationException ex) {
        log.debug("------handleDataIntegrityViolationException {}", ex.getMessage());
        return new ResponseData<>(HttpStatus.CONFLICT, ex.getMessage());
    }

    @ExceptionHandler({AccessDeniedException.class})
    @ResponseStatus(code = HttpStatus.FORBIDDEN)
    public ResponseData<String> handleAccessDeniedException(AccessDeniedException ex){
        log.debug("------handleAccessDeniedException {}", ex.getMessage());
        return new ResponseData<>(HttpStatus.CONFLICT, ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseData<String> handleTypeMismatchException(MethodArgumentTypeMismatchException ex) {
        log.debug("------handle(MethodArgumentTypeMismatchException {}", ex.getMessage());
        return new ResponseData<>(HttpStatus.BAD_REQUEST, ex.getMessage());
    }
}
