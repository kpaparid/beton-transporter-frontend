package com.bt.btbackend.service;

import com.bt.btbackend.model.Settings;
import com.bt.btbackend.model.SettingsDao;
import com.bt.btbackend.model.SettingsDto;
import com.bt.btbackend.repository.AbstractBaseRepositoryImpl;
import com.bt.btbackend.repository.SettingsRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class SettingsServiceImpl extends AbstractBaseRepositoryImpl<SettingsDto, Long>{
    private SettingsRepository myDomainRepository;

    public SettingsServiceImpl(SettingsRepository myDomainRepository) {
        super(myDomainRepository);
    }

    // other specialized methods from the MyDomainService interface

    public List<SettingsDto> findValue(String keyString){
        HashMap<String, String> hm = new HashMap<>();
        hm.put("key_string",keyString);
        return findAllBySpecification(hm);
    }
    public void saveMultiValues(List<Settings> entities) {
        List<SettingsDto> list = new ArrayList<>();
        entities.forEach(e->{
            for (String value:e.getValues()) {
                list.add(new SettingsDto(e.getId(), value));
            }
        });
        super.saveAll(list);
    }
    public void saveOne(SettingsDao entity) {
        List<SettingsDto> oldValue = findValue(entity.getId());
        if(oldValue.size()==0){
            save(new SettingsDto(entity.getId(), entity.getValue()));
        }else {

            save(new SettingsDto(oldValue.get(0).getId(), entity.getId(), entity.getValue()));
        }
    }
    public List<Settings> findAllSettings(Map<String, String> search) {
        HashMap<String, String> searchMap = new HashMap<>();
        for (var s:search.entrySet()) {
            if(s.getKey().equals("id")) searchMap.put("key_string",s.getValue());
            else
                searchMap.put(s.getKey(), s.getValue());
        }
        List<SettingsDto> list = findAllBySpecification(searchMap);
        List<Settings> settings = new ArrayList<>();
        HashSet<String> set = new HashSet<String>();
        list.forEach(e->set.add(e.getKey_string()));
        set.forEach(key-> {
            HashMap<String, String> hm = new HashMap<>();
            hm.put("key_string", key);
            String[] values = list.stream().filter(v->v.getKey_string().equals(key))
                    .map(e -> e.getValue()).collect(Collectors.toList()).toArray(new String[0]);
            settings.add(new Settings(key,values));
        });
        return settings;
    }
}
