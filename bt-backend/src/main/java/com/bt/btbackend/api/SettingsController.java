package com.bt.btbackend.api;

import com.bt.btbackend.model.Settings;
import com.bt.btbackend.model.SettingsDao;
import com.bt.btbackend.model.SettingsDto;
import com.bt.btbackend.security.roles.IsAdmin;
import com.bt.btbackend.security.roles.IsAdminPlus;
import com.bt.btbackend.security.roles.IsUserPlus;
import com.bt.btbackend.service.SettingsServiceImpl;
import com.bt.btbackend.utils.ResponseHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("settings")
public class SettingsController {

    private final SettingsServiceImpl service;

    @Autowired
    SettingsController(SettingsServiceImpl service) {
        this.service = service;
    }

    @IsUserPlus
    @GetMapping()
    public ResponseEntity<Object> findAllBySpecification(@RequestParam Map<String, String> search) {
        try {
            List<Settings> data = service.findAllSettings(search);
            for (Settings s:data) {
                Arrays.sort(s.getValues());
            };
            return ResponseHandler.generateResponse("Successfully loaded data!", HttpStatus.OK, data);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

    @IsUserPlus
    @GetMapping("/{ids}")
    ResponseEntity<Object> getId(@PathVariable Long[] ids) {
        try {
            HashMap<String, List<SettingsDto>> hm = new HashMap<>();
            hm.put("content", service.findByIds(ids));
            return ResponseHandler.generateResponse("Successfully loaded IDs!", HttpStatus.OK, hm);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }

    }
//    @IsAdmin
    @IsUserPlus
@PutMapping()
ResponseEntity<Object> addOne(@RequestBody SettingsDao entity ) {
    try {
        service.saveOne(entity);
        return ResponseHandler.generateResponse("Successfully saved data!", HttpStatus.OK, null);
    } catch (Exception e) {
        return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
    }
}

    @IsAdminPlus
    @PutMapping("/all")
    ResponseEntity<Object> addMany(@RequestBody List<Settings> hm ) {
        try {
            service.saveMultiValues(hm);
            return ResponseHandler.generateResponse("Successfully saved data!", HttpStatus.OK, null);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }

//    @IsAdmin

    @IsAdminPlus
    @DeleteMapping("/{ids}")
    ResponseEntity<Object> deleteIds(@PathVariable Long[] ids) {
        try {
            service.deleteAllById(ids);
            return ResponseHandler.generateResponse("Successfully deleted IDs!", HttpStatus.OK, null);
        } catch (Exception e) {
            return ResponseHandler.generateResponse(e.getMessage(), HttpStatus.MULTI_STATUS, null);
        }
    }


}
