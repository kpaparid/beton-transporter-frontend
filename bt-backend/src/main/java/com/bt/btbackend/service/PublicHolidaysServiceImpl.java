package com.bt.btbackend.service;

import com.bt.btbackend.model.PublicHoliday;
import com.bt.btbackend.repository.AbstractBaseRepositoryImpl;
import com.bt.btbackend.repository.PublicHolidayRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class PublicHolidaysServiceImpl extends AbstractBaseRepositoryImpl<PublicHoliday, Long> {
    private PublicHolidayRepository publicHolidayRepository;

    public PublicHolidaysServiceImpl(PublicHolidayRepository myDomainRepository) {
        super(myDomainRepository);
    }

    public List<PublicHoliday> getHolidays(long year) {

        WebClient client = WebClient.create();
        HashMap<String, String> hm = new HashMap<String, String>();
        hm.put("date_gte", year + ".01.01");
        hm.put("date_lte", year + ".12.31");
        List<PublicHoliday> list = findAllBySpecification(hm);
        if (list.size() == 0) {
            List<PublicHoliday> responseSpecc = client.get()
                    .uri("https://date.nager.at/api/v3/publicholidays/" + year + "/DE")
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<List<PublicHoliday>>() {
                    })
                    .block().stream().filter(publicHoliday -> {
                        String counties = publicHoliday.getCounties();
                        if (counties.equals("")) return true;
                        return Arrays.asList(counties.split(",")).contains("DE-NW");
                    }).collect(Collectors.toList());
            saveAll(responseSpecc);
            return responseSpecc;
        }
        return list;
    }

    public List<PublicHoliday> getWorkableHolidays(long year) {
        return getHolidays(year).stream().filter(publicHoliday -> {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd");
            LocalDate day = LocalDate.parse(publicHoliday.getDate(), formatter);
            String weekDay = day.getDayOfWeek().toString();
            return !weekDay.equals("SATURDAY") && !weekDay.equals("SUNDAY");
        }).collect(Collectors.toList());
    }
}
