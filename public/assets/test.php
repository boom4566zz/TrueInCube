$result = mysqli_query("select * from university")

$uni = array();

while($value  = mysqli_fetch_assoc($result))
{
    $uni[] = $value;
}

for($i = 0;$i<sizeof($uni);$i++)
{
    echo "<option ";
    if($uni[$i]['name'] == $uni_start_up)
    {
       echo "selected";
    }
    echo ">$uni[$i]['name']</option>";
}

