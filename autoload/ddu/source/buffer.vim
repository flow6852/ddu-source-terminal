function! ddu#source#terminal#getterminfo() abort
    var s:bufinfos = getbufinfo()
    var s:ret = []
    for s:info in s:bufinfos
        if getbufvar(get(s:info, "bufnr"), "&buftype") == "terminal"
            add(s:ret, s:info)
        endif 
    endfor
    return s:ret
endfunction
