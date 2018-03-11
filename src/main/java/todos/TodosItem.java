package todos;

import javax.persistence.*;
import java.io.Serializable;

@Entity
public class TodosItem implements Serializable{

    @Id
    private Long id;
    private Boolean isReady;
    private String text;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getIsReady() {
        return isReady;
    }

    public void setIsReady(Boolean done) {
        isReady = done;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
