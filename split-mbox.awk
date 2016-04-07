# awk -f split-mbox.awk mail.mbox
BEGIN{
  chunk=0;
  file = ("chunk_" chunk ".txt");
  print file;
}
/^From /{
  msgs++;
  if(msgs % 100 == 0){
    print
  }
  if(msgs==1000){
    close(file);
    msgs=0;
    chunk++;
    file = ("chunk_" chunk ".txt");
    print file;
  }
}
{
  print > file;
}
