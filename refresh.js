<script>
function refresh(){
    console.log("refresh!");
    $A.get('e.force:refreshView').fire();
}
</script>