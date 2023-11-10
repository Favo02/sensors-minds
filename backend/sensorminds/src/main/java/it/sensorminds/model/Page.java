package it.sensorminds.model;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public abstract class Page {
    private int page;
    private int size;
    private int totalPages;
}
