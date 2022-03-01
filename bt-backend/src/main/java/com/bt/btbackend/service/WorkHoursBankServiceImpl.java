package com.bt.btbackend.service;

import com.bt.btbackend.model.*;
import com.bt.btbackend.security.SecurityService;
import com.bt.btbackend.security.models.User;
import com.bt.btbackend.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.Month;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@Transactional
public class WorkHoursBankServiceImpl {
    private final WorkHoursServiceImpl workHoursService;
    private final AbsentDayServiceImpl absentDayService;
    private final PublicHolidaysServiceImpl publicHolidaysService;
    private final SettingsServiceImpl settingsService;

    @Autowired
    private SecurityService securityService;

    @Autowired
    WorkHoursBankServiceImpl(WorkHoursServiceImpl workHoursService, AbsentDayServiceImpl absentDayService,
                             PublicHolidaysServiceImpl publicHolidaysService, SettingsServiceImpl settingsService) {
        this.workHoursService = workHoursService;
        this.absentDayService = absentDayService;
        this.publicHolidaysService = publicHolidaysService;
        this.settingsService = settingsService;
    }

    public List<WorkHourBankByDateDriver> findByDateDriver(String date) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM");
        YearMonth validatedDate = YearMonth.parse(date, formatter);

//        Map<String, String> settingsSpecification = new HashMap<>();
//        settingsSpecification.put("key_string", "driver");
//        List<SettingsDto> drivers = settingsService.findAllBySpecification(settingsSpecification);
        List<User> drivers = securityService.getUsersByRole("ROLE_DRIVER");

        Map<String, String> workHourSpecification = new HashMap<>();
        Map<String, String> absentDaysSpecification = new HashMap<>();
        workHourSpecification.put("date_gte", date + ".01");
        workHourSpecification.put("date_lte", date + ".31");
        absentDaysSpecification.put("dateFrom_gte", date + ".01");
        absentDaysSpecification.put("dateFrom_lte", date + ".31");

        List<WorkHour> workHoursList = workHoursService.findAllBySpecification(workHourSpecification);
        List<AbsentDay> absentDaysList = absentDayService.findAllBySpecification(absentDaysSpecification);
        List<WorkHourBankByDateDriver> list = new ArrayList<>();
        for (User driver : drivers) {
            List<WorkHour> wList = workHoursList.stream().filter(w -> w.getDriver().equals(driver.getUid())).collect(Collectors.toList());
            List<AbsentDay> aList = absentDaysList.stream()
                    .filter(w -> w.getDriver().equals(driver.getUid())).collect(Collectors.toList());
            int c = calculateWorkHours(wList, aList, validatedDate.getYear()).get(validatedDate.getMonth().getValue())[0];
            String name = driver.getName() == null?driver.getEmail() : driver.getName();
            list.add(new WorkHourBankByDateDriver(driver.getUid(),name, c));
        }

        return list;

    }

    public List<WorkHourBank> findBank(int year, String driver) {
        int currentYear = Integer.parseInt(new SimpleDateFormat("yyyy").format(new Date()));
        if (currentYear >= year) {
            Map<String, String> workHourSpecification = new HashMap<>();
            Map<String, String> absentDaysSpecification = new HashMap<>();
            int endMonth = currentYear == year ? Integer.parseInt(new SimpleDateFormat("MM").format(new Date())) : 12;

            workHourSpecification.put("driver", String.valueOf(driver));
            workHourSpecification.put("date_gte", year + ".01.01");
            workHourSpecification.put("date_lte", year + "." + String.format("%02d", endMonth) + ".31");

            absentDaysSpecification.put("driver", String.valueOf(driver));
            absentDaysSpecification.put("dateFrom_gte", year + ".01.01");
            absentDaysSpecification.put("dateFrom_lte", year + "." + String.format("%02d", endMonth) + ".31");

            List<WorkHour> workHoursList = workHoursService.findAllBySpecification(workHourSpecification);
            List<AbsentDay> absentDaysList = absentDayService.findAllBySpecification(absentDaysSpecification);

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM");
            HashMap<Integer, int[]> hm = calculateWorkHours(workHoursList, absentDaysList, year);
            ArrayList<WorkHourBank> list = new ArrayList<>();
            hm.forEach((k, v) -> {
                list.add(new WorkHourBank(year + "." + String.format("%02d", k), v[0]));
            });
            return list.stream()
                    .filter(d -> YearMonth.parse(d.getDate(), formatter).getMonth().getValue() <= endMonth
                    ).collect(Collectors.toList());
        }
        return null;

    }

    private HashMap<Integer, int[]> calculateWorkHours(
            List<WorkHour> workHoursList, List<AbsentDay> absentDaysList, int year) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd");
        List<LocalDate> publicHolidayList = publicHolidaysService.getWorkableHolidays(year).stream()
                .map(publicHoliday -> LocalDate.parse(publicHoliday.getDate(), formatter))
                .collect(Collectors.toList());
        HashMap<Integer, int[]> hm = new HashMap<>();

        for (Month month : Arrays.stream(Month.values())//.filter(m -> m.getValue() <= endMonth)
                .collect(Collectors.toList())) {
            int[] duration = new int[]{0, 0};
            hm.put(month.getValue(), duration);
        }
        for (WorkHour workHour : workHoursList) {
            String[] words = workHour.getDuration().split(":");
            int month = LocalDate.parse(workHour.getDate(), formatter).getMonth().getValue();
            int[] oldValue = hm.get(month);
            int h = Integer.parseInt(words[0]) + oldValue[0];
            int m = Integer.parseInt(words[1]) + oldValue[1];
            h += m / 60;
            m = m % 60;
            hm.put(month, new int[]{h, m});
        }
//        for (AbsentDay absentDay : absentDaysList) {
//            Set<LocalDate> allLocalDates = new HashSet<>(publicHolidayList);
//            allLocalDates.addAll(Utils.getThisDateDays(absentDay.getDateFrom(), absentDay.getDateTo()));
//            for (LocalDate d : allLocalDates) {
//                int[] oldValue = hm.get(d.getMonth().getValue());
//                int h = 8 + oldValue[0];
//                int m = oldValue[1];
//                hm.put(d.getMonth().getValue(), new int[]{h, m});
//            }
//        }
        return hm;
    }

}
