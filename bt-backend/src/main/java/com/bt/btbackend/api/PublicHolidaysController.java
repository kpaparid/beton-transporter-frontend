package com.bt.btbackend.api;


import com.bt.btbackend.model.PublicHoliday;
import com.bt.btbackend.security.roles.IsUserPlus;
import com.bt.btbackend.service.PublicHolidaysServiceImpl;
import com.bt.btbackend.utils.ResponseHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("public-holidays")
public class PublicHolidaysController {

    private final PublicHolidaysServiceImpl publicHolidaysService;

    @Autowired
    PublicHolidaysController(PublicHolidaysServiceImpl service) {
        this.publicHolidaysService = service;
    }

    @IsUserPlus
    @PutMapping()
    ResponseEntity<Object> addMany(@Valid @RequestBody List<PublicHoliday> newEntries) {
        try {
            publicHolidaysService.saveAll(newEntries);
            return ResponseHandler.generateResponse("Successfully saved data!", HttpStatus.OK, null);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

    @IsUserPlus
    @GetMapping("/{ids}")
    ResponseEntity<Object> getId(@PathVariable Long[] ids) {

        try {
            HashMap<String, List<PublicHoliday>> hm = new HashMap<>();
            hm.put("content", publicHolidaysService.findByIds(ids));
            return ResponseHandler.generateResponse("Successfully loaded IDs!", HttpStatus.OK, hm);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }

    }

    @IsUserPlus
    @DeleteMapping("/{ids}")
    ResponseEntity<Object> deleteIds(@PathVariable Long[] ids) {
        try {
            publicHolidaysService.deleteAllById(ids);
            return ResponseHandler.generateResponse("Successfully deleted IDs!", HttpStatus.OK, null);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

    @IsUserPlus
    @GetMapping()
    public ResponseEntity<Object> findAllBySpecification(@RequestParam Map<String, String> search, Pageable pageable) {
        try {
            return ResponseHandler.generateResponse("Successfully loaded data!", HttpStatus.OK, publicHolidaysService.findAllBySpecification(search, pageable));
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }


}