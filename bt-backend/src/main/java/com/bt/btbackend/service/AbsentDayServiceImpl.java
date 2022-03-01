package com.bt.btbackend.service;

import com.bt.btbackend.model.AbsentDay;
import com.bt.btbackend.repository.AbsentDayRepository;
import com.bt.btbackend.repository.AbstractBaseRepositoryImpl;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class AbsentDayServiceImpl extends AbstractBaseRepositoryImpl<AbsentDay, Long> {
    private AbsentDayRepository absentDayRepository;
//    private AbsentDayRepository absentDayRepository;

    public AbsentDayServiceImpl(AbsentDayRepository myDomainRepository) {
        super(myDomainRepository);
    }


    public void declineOldPendingVacations(){
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("uuuu.MM.dd");
        LocalDate localDate = LocalDate.now();
        String date = dtf.format(localDate);
        HashMap hm = new HashMap();
        hm.put("reason","vacations");
        hm.put("dateFrom_lte",date);
        hm.put("verified","0");
        List<AbsentDay> list = findAllBySpecification(hm);
        List<AbsentDay> l = list.stream().map(vacation -> {
            vacation.setVerified(-1);
            return vacation;
        }).collect(Collectors.toList());
        saveAll(l);
    }

    public List<AbsentDay> findActiveVacations() {
        Date date = new Date();
        String strDateFormat = "yyyy.MM.dd";
        DateFormat dateFormat = new SimpleDateFormat(strDateFormat);
        String formattedDate= dateFormat.format(date);
        HashMap<String, String> hm = new HashMap<>();
        hm.put("dateFrom_lte", formattedDate);
        hm.put("dateTo_gte", formattedDate);
        hm.put("reason", "vacations");
        return findAllBySpecification(hm);
    }
    public List<AbsentDay> findUpcomingVacations() {
        Date date = new Date();
        String strDateFormat = "yyyy.MM.dd";
        DateFormat dateFormat = new SimpleDateFormat(strDateFormat);
        String formattedDate= dateFormat.format(date);
        HashMap<String, String> hm = new HashMap<>();
        hm.put("dateFrom_gt", formattedDate);
        hm.put("reason", "vacations");
        return findAllBySpecification(hm);
    }
    public List<AbsentDay> findActiveAndUpcomingVacations() {
        List<AbsentDay> active = findActiveVacations();
        List<AbsentDay> upcoming = findUpcomingVacations();
        HashSet<AbsentDay> hs = new HashSet<>(active);
        hs.addAll(upcoming);
        return new ArrayList<>(hs);
    }


    public HashMap<String, Integer> findVacations(String driver, int year)  {


        UserRecord user = null;
        try {
            user = FirebaseAuth.getInstance().getUser(driver);
        } catch (FirebaseAuthException e) {
            e.printStackTrace();
        }
        Map<String, Object> claims = new HashMap<>();
        user.getCustomClaims().forEach((k, v) -> claims.put(k, v));

        HashMap<String, String> hm = new HashMap<>();
        int vacationDays;
        try{
             vacationDays = ((BigDecimal)  claims.get("vacationDays")).intValue();
        }catch (Exception e){
            vacationDays = Integer.parseInt(((String)  claims.get("vacationDays")));
        }
//        int vacationDays = object == null ? 26 : object.intValue();

        hm.put("driver", driver);
        hm.put("dateFrom_gte", year +".01.01");
        hm.put("dateFrom_lt", year + ".12.31");
        hm.put("reason","vacations");

        HashMap<String, String> cm = new HashMap<>();
        cm.put("driver", driver);
        cm.put("dateTo_gte", year +".01.01");
        cm.put("dateTo_lt", year + ".12.31");
        cm.put("reason","vacations");


        List<AbsentDay> c1 = findAllBySpecification(hm);
        List<AbsentDay> c2 = findAllBySpecification(cm);
        HashMap<String, AbsentDay> map3 = new HashMap<>();
        Set<AbsentDay> hashset = new HashSet<>(c1);
        hashset.addAll(c2);
        int taken = hashset.stream().map(d -> getThisDateDays(d, year))
                .reduce(new ArrayList<LocalDate>(), (subtotal, element) -> {
                    subtotal.addAll(element);
                    return subtotal;
                }).size();
        int rest = vacationDays - taken;
        HashMap<String, Integer> map = new HashMap<>();
        map.put("rest", rest);
        map.put("taken", taken);
        return map;


    }
    private List<LocalDate> getThisDateDays(AbsentDay absentDay, int year){

        String begin = absentDay.getDateFrom();
        String end = absentDay.getDateTo();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd");
        LocalDate startDate = LocalDate.parse(begin,formatter);
        LocalDate endDate = LocalDate.parse(end,formatter).plusDays(1);
        List<LocalDate> c = startDate.datesUntil(endDate).collect(Collectors.toList());
        
        
        return startDate.datesUntil(endDate).collect(Collectors.toList()).stream().filter(d -> {
            String weekDay = d.getDayOfWeek().toString();
            return d.getYear()==year &&!weekDay.equals("SATURDAY") && 
                    !weekDay.equals("SUNDAY");
        }).collect(Collectors.toList());

    }

}
