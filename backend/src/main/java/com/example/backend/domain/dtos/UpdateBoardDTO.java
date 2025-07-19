package com.example.backend.domain.dtos;

import java.util.Optional;

public class UpdateBoardDTO {
    private Optional<String> title = Optional.empty();
    private Optional<String> content = Optional.empty();

    public Optional<String> getTitle() {
        return title;
    }

    public void setTitle(Optional<String> title) {
        this.title = title;
    }

    public Optional<String> getContent() {
        return content;
    }

    public void setContent(Optional<String> content) {
        this.content = content;
    }
}