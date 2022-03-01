package com.bt.btbackend.service;

import com.bt.btbackend.model.SettingsDto;
import com.bt.btbackend.model.Tour;
import com.bt.btbackend.utils.Utils;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

@Service
@Transactional
public class TourServiceImpl2 {

    private final TourServiceImpl tourService;
    private final SettingsServiceImpl settingsService;

    public TourServiceImpl2(TourServiceImpl tourService, SettingsServiceImpl settingsService) {
        this.tourService = tourService;
        this.settingsService = settingsService;

    }

    public double findCbm(String date) {
        HashMap<String, String> hm = new HashMap<String, String>();
        Utils.validateYearMonth(date);

        hm.put("date_gte", date + ".01");
        hm.put("date_lte", date + ".31");
        List<Tour> tours = tourService.findAllBySpecification(hm);
        double cbm = tours.stream().reduce(0.0, (a, b) -> a + b.getCbm(), Double::sum);
        return cbm;
    }

    public double findCbmByWorkPlant(String date, String workPlant) {

        HashMap<String, String> hm = new HashMap<String, String>();
        Utils.validateYear(date);
        hm.put("date_gte", date + ".01.01");
        hm.put("date_lte", date + ".12.31");
        hm.put("workPlant", workPlant);
        List<Tour> tours = tourService.findAllBySpecification(hm);
        double cbm = tours.stream().reduce(0.0, (a, b) -> a + b.getCbm(), Double::sum);
        return cbm;
    }

    public Object findYearCbm(String date) {
        Utils.validateYear(date);


        HashMap<String, Double> dateMap = new HashMap<String, Double>();
        HashMap<String, String> hm = new HashMap<String, String>();
        List<Tour> tours = tourService.findAllBySpecification(hm);
        List<HashMap<String, String>> list = new ArrayList<>();

        hm.put("date_gte", date + ".01.01");
        hm.put("date_lte", date + ".12.31");


        for (Tour t:tours) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd");
            LocalDate dateTime = LocalDate.parse(t.getDate(), formatter);
            String yearMonth = date+"."+String.format("%02d",dateTime.getMonth().getValue());
            double oldCbm = dateMap.get(yearMonth) == null ? 0 : dateMap.get(yearMonth);
            double cbm = oldCbm + t.getCbm();
            dateMap.put(yearMonth,cbm);
        }
        Set<String> keys = dateMap.keySet();
        for (String key:keys) {
            HashMap<String, String> entity = new HashMap<>();
            entity.put("date", key);
            entity.put("cbm", dateMap.get(key).toString());
            list.add(entity);
        }

        return list;
    }

    public double findSales(String date) {
        Utils.validateYearMonth(date);
        int price = Integer.parseInt(settingsService.findValue("priceCbm").get(0).getValue());
        return  findCbm(date) * price;
    }

    public List<HashMap<String, String>> findCbmByAllWorkPlants(String date) {
        List<SettingsDto> workPlants = settingsService.findValue("workPlant");
        List<HashMap<String,String>> list = new ArrayList<>();

        ObjectMapper mapper = new ObjectMapper();

        try {
            String[] pp1 = mapper.readValue(workPlants.get(0).getValue(), String[].class);
            for (String w : pp1) {
                HashMap<String, String> hm = new HashMap<String, String>();
                hm.put("cbm", String.valueOf(findCbmByWorkPlant(date, w)));
                hm.put("workPlant", w);
                list.add(hm);
            }
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }


        return list;
    }



}
